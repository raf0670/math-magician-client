"use client";

import { useState } from "react";
import Image from "next/image";

export default function StudentAvatar({
  name = "Student",
  profileImageThumbUrl = "",
  profileImageUrl = "",
  sizes = "40px",
  className = "",
}) {
  const [failedImageUrls, setFailedImageUrls] = useState([]);
  const displayName = typeof name === "string" && name.trim() ? name.trim() : "Student";
  const imageCandidates = [...new Set([profileImageThumbUrl, profileImageUrl].filter(Boolean))];
  const imageUrl = imageCandidates.find((candidate) => !failedImageUrls.includes(candidate)) || "";
  const showImage = Boolean(imageUrl);
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden ${className}`}>
      {showImage ? (
        <Image
          src={imageUrl}
          alt={`${displayName} profile picture`}
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => setFailedImageUrls((current) => (
            current.includes(imageUrl) ? current : [...current, imageUrl]
          ))}
        />
      ) : (
        <span
          role="img"
          aria-label={`${displayName} profile picture fallback`}
          className="flex h-full w-full items-center justify-center"
        >
          {initial}
        </span>
      )}
    </span>
  );
}
