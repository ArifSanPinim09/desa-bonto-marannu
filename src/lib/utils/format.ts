import { format as dateFnsFormat, parseISO } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format a date string or Date object to Indonesian locale
 */
export function formatDate(
  date: string | Date,
  formatStr: string = "dd MMMM yyyy"
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return dateFnsFormat(dateObj, formatStr, { locale: id });
}

/**
 * Format a date to relative time (e.g., "2 hari yang lalu")
 */
export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Hari ini";
  if (diffInDays === 1) return "Kemarin";
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu yang lalu`;
  if (diffInDays < 365)
    return `${Math.floor(diffInDays / 30)} bulan yang lalu`;
  return `${Math.floor(diffInDays / 365)} tahun yang lalu`;
}

/**
 * Format a number to Indonesian currency format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}

/**
 * Truncate text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Extract plain text from HTML content
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Generate excerpt from HTML content
 */
export function generateExcerpt(
  html: string,
  maxLength: number = 200
): string {
  const plainText = stripHtml(html);
  return truncateText(plainText, maxLength);
}
