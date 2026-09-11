export const MAX_PROFILE_PHOTO_SIZE = 2 * 1024 * 1024;
export const PROFILE_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function matchesPhotoType(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (type === "image/png") {
    return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte);
  }
  if (type === "image/webp") {
    return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}
