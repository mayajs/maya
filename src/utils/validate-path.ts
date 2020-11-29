export function validatePath(path: string): string {
  return path ? (path.startsWith("/") ? ("/" + path.replace(/\/+$/, "")).replace(/\/+/g, "/") : "/" + path.replace(/\/+$/, "")) : "/";
}
