export function getImageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${path}`;
}
// export function getImageUrl(path: string): string {
//   return `${path}`;
// }