export function getImageUrl(path: string): string {
  // Si la URL ya es completa (empieza con http:// o https://), devolverla tal cual
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }
  // Si es una ruta relativa, devolverla tal cual (ya que ahora vienen completas)
  return path;
}
