/**
 * Returns a displayable URL for any stored asset.
 *
 * New uploads (post-Cloudinary migration) store full https://res.cloudinary.com/... URLs.
 * Legacy records store bare filenames like "thumbnailImage-1775383567022.png".
 * This utility handles both transparently.
 */
export const getAssetUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-course.jpg';

  // If the path contains a full URL (even if prefixed with local API paths by mistake)
  // We look for the LAST occurrence of 'http' to handle cases like:
  // http://localhost:3020/api/upload/courses/https://res.cloudinary.com/...
  const lastHttpIndex = path.lastIndexOf('http');
  if (lastHttpIndex !== -1 && lastHttpIndex !== 0) {
    return path.substring(lastHttpIndex);
  }

  // Already a full URL starting at the beginning — return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Legacy: bare filename or relative path served by the backend static file server
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api';

  let cleanPath = path;

  // Strip leading slash
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }

  // Strip legacy "uploads/" or "upload/" prefixes — backend serves them under /api/upload/
  cleanPath = cleanPath.replace(/^uploads\//, '');
  cleanPath = cleanPath.replace(/^upload\//, '');

  return `${apiBase}/upload/${cleanPath}`;
};
