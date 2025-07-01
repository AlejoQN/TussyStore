export function estimarDiasEntrega(destino: string) {
  if (!destino) return 5;
  const destinoLower = destino.toLowerCase();
  if (
    destinoLower.includes("medellín") ||
    destinoLower.includes("medellin") ||
    destinoLower.includes("itagüí") ||
    destinoLower.includes("itagui") ||
    destinoLower.includes("sabaneta") ||
    destinoLower.includes("envigado")
  ) {
    return 1;
  }
  if (destinoLower.includes("antioquia")) {
    return 2;
  }
  return 4;
}
