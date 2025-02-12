"use client";

import { useProductType } from "@/context/product-type-context";
import Step1CreateProduct from "./components/step1-create-product";
import Step2AddAttributes from "./components/step2-add-attributes";
import Step3NotAllowedComb from "./components/step3-not-allowed-comb";

export default function CreateProductType() {
  const { step, error } = useProductType(); 

  return (
    <div className="ml-64 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-dark mb-6">
        {step === 1 && "Step 1: Create Product Type"}
        {step === 2 && "Step 2: Add Attributes"}
        {step === 3 && "Step 3: Define Not-Allowed Combinations"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {step === 1 && <Step1CreateProduct />}
      {step === 2 && <Step2AddAttributes />}
      {step === 3 && <Step3NotAllowedComb />}
    </div>
  );
}