export const getAssetUrl = (path: string | undefined | null) => {
  if (!path) return "/placeholder-course.jpg"; // Fallback placeholder
  
  if (path.startsWith("http")) return path;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3020/api";
  
  // Normalize path: handle "uploads/" from DB and ensure it's served via backend's static prefix /api/upload
  // If the path already has "courses/" in it, we don't need to append it.
  
  let cleanPath = path;
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.substring(1);
  }
  
  // Replace "uploads/" with nothing because the prefix /api/upload in main.ts handles the folder mapping
  cleanPath = cleanPath.replace(/^uploads\//, "");
  cleanPath = cleanPath.replace(/^upload\//, "");

  // If the backend already includes /api, we append /upload
  // If apiBase is https://backend.com/api, the result is https://backend.com/api/upload/cleanPath
  return `${apiBase}/upload/${cleanPath}`;
};
