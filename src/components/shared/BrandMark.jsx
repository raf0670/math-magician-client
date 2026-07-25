export default function BrandMark({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`block bg-contain bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: "url('/favicon.ico')" }}
    />
  );
}
