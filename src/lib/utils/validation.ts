/**
 * Validate Indonesian NIK (Nomor Induk Kependudukan)
 * NIK must be exactly 16 digits
 */
export function validateNIK(nik: string): boolean {
  return /^\d{16}$/.test(nik);
}

/**
 * Validate Indonesian postal code
 * Postal code must be exactly 5 digits
 */
export function validatePostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode);
}

/**
 * Validate NIP (Nomor Induk Pegawai)
 * NIP must be exactly 18 digits
 */
export function validateNIP(nip: string): boolean {
  return /^\d{18}$/.test(nip);
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validate image file type
 */
export function validateImageType(file: File): boolean {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  return allowedTypes.includes(file.type);
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a date is not in the future
 */
export function isNotFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj <= new Date();
}
