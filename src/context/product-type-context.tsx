"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AttributeString, ProductTypeDetails } from "../types/product-types";


interface ProductTypeContextProps {
  step: number;
  setStep: (step: number) => void;
  name: string;
  setName: (name: string) => void;
  customisation: string;
  setCustomisation: (customisation: string) => void;
  attributes: AttributeString[];
  setAttributes: (attributes: AttributeString[]) => void;
  productType: ProductTypeDetails | null;
  setProductType: (productType: ProductTypeDetails | null) => void;
  productTypeId: string | null;
  setProductTypeId: (id: string | null) => void;
  notAllowedCombinations: { attributeId: number; attributeOptionId: number }[][];
  setNotAllowedCombinations: (
    combinations: { attributeId: number; attributeOptionId: number }[][]
  ) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  reset: () => void;
}

const ProductTypeContext = createContext<ProductTypeContextProps | undefined>(
  undefined
);

export function ProductTypeProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [customisation, setCustomisation] = useState<string>(
    "fully_customizable"
  );
  const [attributes, setAttributes] = useState<AttributeString[]>([
    { attributeName: "", possibleOptions: [""] },
  ]);
  const [productType, setProductType] = useState<ProductTypeDetails | null>(null);
  const [productTypeId, setProductTypeId] = useState<string | null>(null);
  const [notAllowedCombinations, setNotAllowedCombinations] = useState<
    { attributeId: number; attributeOptionId: number }[][]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setStep(1);
    setName("");
    setCustomisation("fully_customizable");
    setAttributes([{ attributeName: "", possibleOptions: [""] }]);
    setProductType(null);
    setProductTypeId(null);
    setNotAllowedCombinations([]);
    setLoading(false);
    setError(null);
  }

  return (
    <ProductTypeContext.Provider
      value={{
        step,
        setStep,
        name,
        setName,
        customisation,
        setCustomisation,
        attributes,
        setAttributes,
        productType,
        setProductType,
        productTypeId,
        setProductTypeId,
        notAllowedCombinations,
        setNotAllowedCombinations,
        loading,
        setLoading,
        error,
        setError,
        reset,
      }}
    >
      {children}
    </ProductTypeContext.Provider>
  );
}

export function useProductType() {
  const context = useContext(ProductTypeContext);
  if (!context) {
    throw new Error("useProductType must be used within a ProductTypeProvider");
  }
  return context;
}