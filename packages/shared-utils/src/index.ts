import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const m = Math.floor(diffMs / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (m < 1) return "agora";
  if (m < 60) return `${m}m atrás`;
  if (h < 24) return `${h}h atrás`;
  if (d < 7)  return `${d}d atrás`;
  return formatDate(date);
}

export function initials(name: string): string {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max - 3) + "...";
}
