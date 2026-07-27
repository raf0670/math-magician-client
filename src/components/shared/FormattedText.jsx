const INLINE_TAGS = new Set(["u", "b", "strong", "i", "em", "sub", "sup"]);
const TOKEN_PATTERN = /(<\/?[a-z][a-z0-9]*(?:\s+[^<>]*)?\s*\/?>)/gi;

function classifyToken(token) {
  const breakMatch = token.match(/^<br\s*\/?>$/i);
  if (breakMatch) return { kind: "break" };

  const openMatch = token.match(/^<([a-z]+)>$/i);
  if (openMatch) {
    const name = openMatch[1].toLowerCase();
    return INLINE_TAGS.has(name) ? { kind: "open", name } : { kind: "text" };
  }

  const closeMatch = token.match(/^<\/([a-z]+)>$/i);
  if (closeMatch) {
    const name = closeMatch[1].toLowerCase();
    return INLINE_TAGS.has(name) ? { kind: "close", name } : { kind: "text" };
  }

  return { kind: "text" };
}

function findMatchingClose(tokens, openIndex, endIndex, tagName) {
  let depth = 0;

  for (let index = openIndex + 1; index < endIndex; index += 1) {
    const token = classifyToken(tokens[index]);

    if (token.kind === "open" && token.name === tagName) {
      depth += 1;
    }

    if (token.kind === "close" && token.name === tagName) {
      if (depth === 0) return index;
      depth -= 1;
    }
  }

  return -1;
}

function parseRange(tokens, startIndex = 0, endIndex = tokens.length) {
  const nodes = [];
  let index = startIndex;

  while (index < endIndex) {
    const rawToken = tokens[index];
    const token = classifyToken(rawToken);

    if (token.kind === "break") {
      nodes.push({ kind: "break" });
      index += 1;
      continue;
    }

    if (token.kind === "open") {
      const closeIndex = findMatchingClose(tokens, index, endIndex, token.name);

      if (closeIndex >= 0) {
        nodes.push({
          kind: "element",
          name: token.name,
          children: parseRange(tokens, index + 1, closeIndex),
        });
        index = closeIndex + 1;
        continue;
      }
    }

    nodes.push(rawToken);
    index += 1;
  }

  return nodes;
}

function parseFormattedText(value) {
  const text = value === null || value === undefined ? "" : value.toString();
  return parseRange(text.split(TOKEN_PATTERN).filter(Boolean));
}

function renderNodes(nodes, keyPrefix = "formatted") {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;

    if (typeof node === "string") return node;
    if (node.kind === "break") return <br key={key} />;

    const Tag = node.name;
    return <Tag key={key}>{renderNodes(node.children, key)}</Tag>;
  });
}

export default function FormattedText({ value, className, as: Component = "span" }) {
  return <Component className={className}>{renderNodes(parseFormattedText(value))}</Component>;
}
