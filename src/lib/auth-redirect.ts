export function getAuthRedirect(path: string) {
  if (typeof window !== "undefined") {
    return new URL(path, window.location.origin).toString();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is required for server-side auth redirects");
  }

  return new URL(path, appUrl).toString();
}

export function getSafeNextPath(value: string | null, fallback = "/home") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}
