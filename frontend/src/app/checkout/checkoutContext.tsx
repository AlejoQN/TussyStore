"use client";
import React, { createContext, useContext, useState } from "react";

type Direccion = {
  codigoPostal: any;
  ciudad: any;
  calle: any;
  nombre: string;
  direccion: string;
  departamento: string;
  municipio: string;
  barrio: string;
  apartamento: string;
  indicaciones: string;
  telefono: string;
};

type MetodoPago = "mercadopago" | "bancolombia" | "nequi" | "contraentrega";

type CheckoutContextType = {
  direccion: Direccion | null;
  setDireccion: (d: Direccion) => void;
  metodoPago: MetodoPago | null;
  setMetodoPago: (m: MetodoPago) => void;
  reset: () => void;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [direccion, setDireccion] = useState<Direccion | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);

  const reset = () => {
    setDireccion(null);
    setMetodoPago(null);
  };

  return (
    <CheckoutContext.Provider
      value={{ direccion, setDireccion, metodoPago, setMetodoPago, reset }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx)
    throw new Error("useCheckout debe usarse dentro de CheckoutProvider");
  return ctx;
}
