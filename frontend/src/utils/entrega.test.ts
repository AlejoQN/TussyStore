import { estimarDiasEntrega } from "./entrega";

describe("estimarDiasEntrega", () => {
  it("devuelve 5 si el destino es vacío", () => {
    expect(estimarDiasEntrega("")).toBe(5);
  });

  it("devuelve 1 para Medellín y municipios cercanos", () => {
    expect(estimarDiasEntrega("Medellín")).toBe(1);
    expect(estimarDiasEntrega("Itagüí")).toBe(1);
    expect(estimarDiasEntrega("Sabaneta")).toBe(1);
    expect(estimarDiasEntrega("Envigado")).toBe(1);
  });

  it("devuelve 2 para Antioquia", () => {
    expect(estimarDiasEntrega("Antioquia")).toBe(2);
  });

  it("devuelve 4 para otros destinos", () => {
    expect(estimarDiasEntrega("Bogotá")).toBe(4);
    expect(estimarDiasEntrega("Cali")).toBe(4);
  });
});
