"use client";

import { useEffect, useRef, useState } from "react";

/** Game logo with an initials fallback when the image file is missing or broken. */
export default function GameImg({
  src,
  name,
  className,
  size = 256,
  priority = false,
}: {
  src: string;
  name: string;
  className?: string;
  /** intrinsic square size in px, reserves layout space before the file loads */
  size?: number;
  /** true only for the largest above-the-fold image */
  priority?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // The image may have failed before hydration attached onError, so check once mounted.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setBroken(true);
  }, []);

  if (broken) {
    const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    return (
      <span
        className={`grid place-items-center font-extrabold ${className ?? ""}`}
        style={{ background: "var(--panel-2)", color: "var(--coin)", fontSize: "1.4em" }}
        role="img"
        aria-label={name}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      ref={ref}
      src={src}
      alt=""
      width={size}
      height={size}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={className}
      onError={() => setBroken(true)}
    />
  );
}
