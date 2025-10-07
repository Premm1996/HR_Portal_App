/**
 * Photo utility functions for handling photo URLs and display
 */

/**
 * Get the full URL for a photo stored on the backend
 * @param photoPath - Relative path from backend (e.g., "/uploads/profile-photos/photo.jpg")
 * @returns Full URL to access the photo from backend
 */
export function getPhotoUrl(photoPath: string | null | undefined): string | null {
  if (!photoPath) return null;

  // If it's already a full URL, return as is
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    console.log('📸 Photo is already a full URL:', photoPath);
    return photoPath;
  }

  // If it's a relative path, prepend backend URL
  if (photoPath.startsWith('/uploads/')) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const fullUrl = `${backendUrl}${photoPath}`;
    console.log('📸 Constructed photo URL:', fullUrl);
    return fullUrl;
  }

  // If it's just a filename, assume it's in uploads
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const fullUrl = `${backendUrl}/uploads/${photoPath}`;
  console.log('📸 Constructed photo URL from filename:', fullUrl);
  return fullUrl;
}

/**
 * Get a fallback photo URL when no photo is available
 * @param employeeId - Employee ID for initials
 * @param employeeName - Employee name for initials
 * @returns URL to a placeholder avatar or null
 */
export function getFallbackPhoto(employeeId: string, employeeName?: string): string | null {
  // For now, return null to show initials
  // In the future, this could return a URL to a default avatar service
  console.log('📸 Using fallback photo (initials) for employee:', employeeName || employeeId);
  return null;
}

/**
 * Check if a photo URL is accessible
 * @param photoUrl - URL to check
 * @returns Promise<boolean> indicating if photo is accessible
 */
export function isPhotoAccessible(photoUrl: string): Promise<boolean> {
  console.log('🔍 Checking if photo is accessible:', photoUrl);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log('✅ Photo is accessible:', photoUrl);
      resolve(true);
    };
    img.onerror = () => {
      console.error('❌ Photo is not accessible:', photoUrl);
      resolve(false);
    };
    img.src = photoUrl;

    // Timeout after 10 seconds
    setTimeout(() => {
      console.warn('⚠️ Photo accessibility check timed out:', photoUrl);
      resolve(false);
    }, 10000);
  });
}

/**
 * Get photo URL with fallback handling
 * @param photoPath - Original photo path
 * @param employeeId - Employee ID for fallback
 * @param employeeName - Employee name for fallback
 * @returns Best available photo URL
 */
export async function getBestPhotoUrl(
  photoPath: string | null | undefined,
  employeeId: string,
  employeeName?: string
): Promise<string | null> {
  console.log('🔄 Getting best photo URL for:', employeeName || employeeId, 'Photo path:', photoPath);

  const photoUrl = getPhotoUrl(photoPath);

  if (!photoUrl) {
    console.log('⚠️ No photo URL available, using fallback');
    return getFallbackPhoto(employeeId, employeeName);
  }

  // Check if photo is accessible, if not, return fallback
  const isAccessible = await isPhotoAccessible(photoUrl);
  if (!isAccessible) {
    console.warn('⚠️ Photo not accessible, using fallback:', photoUrl);
    return getFallbackPhoto(employeeId, employeeName);
  }

  console.log('✅ Photo URL is accessible:', photoUrl);
  return photoUrl;
}

/**
 * Simple function to get photo URL without accessibility check (for immediate use)
 * @param photoPath - Original photo path
 * @returns Photo URL or null
 */
export function getPhotoUrlSimple(photoPath: string | null | undefined): string | null {
  console.log('📸 Getting simple photo URL for:', photoPath);
  return getPhotoUrl(photoPath);
}
