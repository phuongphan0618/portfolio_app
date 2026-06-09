/**
 * Convert common share links (Google Drive, Dropbox) into direct image URLs
 * so they render inside an <img> tag. Direct URLs pass through unchanged.
 */
export function resolveImageUrl(raw: string): string {
  const url = (raw || "").trim()
  if (!url) return ""

  // Google Drive: .../file/d/<id>/view  OR  ...?id=<id>
  const driveFile = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveFile) {
    return `https://drive.google.com/thumbnail?id=${driveFile[1]}&sz=w1000`
  }
  const driveOpen = url.match(/drive\.google\.com\/open\?id=([^&]+)/)
  if (driveOpen) {
    return `https://drive.google.com/thumbnail?id=${driveOpen[1]}&sz=w1000`
  }
  const driveUc = url.match(/drive\.google\.com\/uc\?(?:export=view&)?id=([^&]+)/)
  if (driveUc) {
    return `https://drive.google.com/thumbnail?id=${driveUc[1]}&sz=w1000`
  }

  // Dropbox: convert to raw content
  if (url.includes("dropbox.com")) {
    return url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace(/\?dl=\d/, "")
  }

  // Already a direct/usable URL
  return url
}
