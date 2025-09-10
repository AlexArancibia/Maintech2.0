export function getStrapiMediaUrl(path?: string) {
  if (!path) return "";
  const base = process.env.NEXT_PUBLIC_STRAPI_ENDPOINT || "";
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
