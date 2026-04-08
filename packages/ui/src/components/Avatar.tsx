import React from "react";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({ name, src, size = "md", className = "" }: AvatarProps) {
  const ini = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ${className}`} />;
  }
  return (
    <span className={`${sizes[size]} rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold ${className}`}>
      {ini}
    </span>
  );
}
