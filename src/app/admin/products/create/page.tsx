"use client";

import React, { useState } from "react";
import { API_BASE_URL } from "@/config/config";
import { useProductTypes } from "@/hooks/use-product-types";
import { useProductTypeDetails } from "@/hooks/use-product-type-details";
import { useRouter } from "next/navigation";

export default function AdminCreateProductPage() {
  const router = useRouter();
  
  // -------------------------------
  // States for Product Type selection
  // -------------------------------
  const { productTypes, loading: loadingTypes } = useProductTypes();
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<string>("");
  const { productTypeDetails , loading: loadingTypeDetails } =
     useProductTypeDetails(selectedProductTypeId);
  const [error] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // -------------------------------
  // Basic product form fields
  // -------------------------------
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [mainPictureFile, setMainPictureFile] = useState<File | null>(null);
  const [imageGalleryFiles, setImageGalleryFiles] = useState<FileList | null>(null);

  // -------------------------------
  // Overrides
  // -------------------------------
  // attributeOverrides
  const [deactivatedAttributes, setDeactivatedAttributes] = useState<
    { attributeId: number }[]
  >([]);
  const [deactivatedOptions, setDeactivatedOptions] = useState<
    { attributeId: number; optionId: number }[]
  >([]);
  const [outOfStockOptions, setOutOfStockOptions] = useState<
    { attributeId: number; optionId: number }[]
  >([]);

  // notAllowedCombinationsOverrides
  const [deactivateCombinations, setDeactivateCombinations] = useState<
    { combinationId: number }[]
  >([]);

  // For admin to add new not-allowed combinations
  const [productNotAllowedCombinations, setProductNotAllowedCombinations] = useState<
    { attributeId: number; attributeOptionId: number }[][]
  >([]);


  // -------------------------------
  // Handlers for attribute/option overrides
  // -------------------------------
  function handleAttributeDeactivate(attributeId: number, checked: boolean) {
    if (checked) {
      setDeactivatedAttributes((prev) => [...prev, { attributeId }]);
    } else {
      setDeactivatedAttributes((prev) =>
        prev.filter((item) => item.attributeId !== attributeId)
      );
    }
  }

  function handleOptionDeactivate(
    attributeId: number,
    optionId: number,
    checked: boolean
  ) {
    if (checked) {
      setDeactivatedOptions((prev) => [...prev, { attributeId, optionId }]);
    } else {
      setDeactivatedOptions((prev) =>
        prev.filter(
          (item) => item.attributeId !== attributeId || item.optionId !== optionId
        )
      );
    }
  }

  function handleOptionOutOfStock(
    attributeId: number,
    optionId: number,
    checked: boolean
  ) {
    if (checked) {
      setOutOfStockOptions((prev) => [...prev, { attributeId, optionId }]);
    } else {
      setOutOfStockOptions((prev) =>
        prev.filter(
          (item) => item.attributeId !== attributeId || item.optionId !== optionId
        )
      );
    }
  }

  // -------------------------------
  // Handle "deactivate" for existing not_allowed_combinations
  // -------------------------------
  function handleDeactivateCombination(combinationId: number, checked: boolean) {
    if (checked) {
      setDeactivateCombinations((prev) => [...prev, { combinationId }]);
    } else {
      setDeactivateCombinations((prev) =>
        prev.filter((c) => c.combinationId !== combinationId)
      );
    }
  }

  // -------------------------------
  // Handle form submission
  // -------------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("sku", sku);
      formData.append("description", description);
      formData.append("price", price);
      if (selectedProductTypeId) {
        formData.append("productTypeId", selectedProductTypeId);
      }

      if (mainPictureFile) {
        formData.append("main_picture", mainPictureFile);
      }
      if (imageGalleryFiles) {
        Array.from(imageGalleryFiles).forEach((file) =>
          formData.append("image_gallery", file)
        );
      }


      // Convert objects to JSON
      const formattedAttributeOverrides = {
        deactivatedAttributes,
        deactivatedOptions,
        outOfStockOptions,
      };
      
      formData.append("attributeOverrides", new Blob([JSON.stringify(formattedAttributeOverrides)], { type: "application/json" }));
  
      const formattedNotAllowedCombinationsOverrides = {
        deactivate: deactivateCombinations,
      };
      formData.append("notAllowedCombinationsOverrides", new Blob([JSON.stringify(formattedNotAllowedCombinationsOverrides)], { type: "application/json" }));

      formData.append("productNotAllowedCombinations", new Blob([JSON.stringify(productNotAllowedCombinations)], { type: "application/json" }));

      const res = await fetch(`${API_BASE_URL}/v1/admin/products`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error creating product: ${text}`);
      }

      setSuccessMessage("Product created successfully! Redirecting...");
      
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
      
    } catch (err) {
      alert((err as Error).message);
    }
  }

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Product</h1>

      {successMessage && (
        <p className="text-green-600 font-semibold mb-2">{successMessage}</p>
      )}

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Product Type Selection */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Product Type</label>
        {loadingTypes ? (
          <p>Loading Product Types...</p>
        ) : (
          <select
            className="border p-2"
            value={selectedProductTypeId}
            onChange={(e) => {
              setSelectedProductTypeId(e.target.value);
              // Reset overrides on new type
              setDeactivatedAttributes([]);
              setDeactivatedOptions([]);
              setOutOfStockOptions([]);
              setDeactivateCombinations([]);
              setProductNotAllowedCombinations([]);
            }}
          >
            <option value="">Select Product Type</option>
            {productTypes.map((pt) => (
              <option key={pt.id} value={pt.id}>
                {pt.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic product fields */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">SKU</label>
          <input
            className="border p-2 w-full"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="border p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            className="border p-2 w-full"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Main Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setMainPictureFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Image Gallery</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImageGalleryFiles(e.target.files)}
          />
        </div>

        {/* 
          -- AFTER the images, we show the attribute configs --
          Only if we have productTypeDetails
        */}
        {loadingTypeDetails && <p>Loading Type Details...</p>}
        {productTypeDetails && (
          <div className="border p-3 rounded">
            <h2 className="font-bold mb-2">
              Attributes for {productTypeDetails.name}
            </h2>

            {productTypeDetails.attributes.map((attr) => (
              <div key={attr.id} className="mb-2 border-b pb-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{attr.name}</h3>
                  <label className="text-sm flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={deactivatedAttributes.some(
                        (x) => x.attributeId === attr.id
                      )}
                      onChange={(e) =>
                        handleAttributeDeactivate(attr.id, e.target.checked)
                      }
                    />
                    Deactivate
                  </label>
                </div>

                {/* Options */}
                <div className="pl-4 mt-1">
                  {attr.options.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span>{opt.name}</span>
                      <label className="text-sm flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={deactivatedOptions.some(
                            (x) =>
                              x.attributeId === attr.id && x.optionId === opt.id
                          )}
                          onChange={(e) =>
                            handleOptionDeactivate(
                              attr.id,
                              opt.id,
                              e.target.checked
                            )
                          }
                        />
                        Deactivate
                      </label>
                      <label className="text-sm flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={outOfStockOptions.some(
                            (x) =>
                              x.attributeId === attr.id && x.optionId === opt.id
                          )}
                          onChange={(e) =>
                            handleOptionOutOfStock(
                              attr.id,
                              opt.id,
                              e.target.checked
                            )
                          }
                        />
                        Out of stock
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Not Allowed Combinations */}
            <div className="mt-4">
              <h3 className="font-bold">Not Allowed Combinations</h3>
              {productTypeDetails.notAllowedCombinations.map((combo) => (
                <div key={combo.combinationId} className="border-b py-2">
                  <div className="flex items-center gap-3">
                    <strong>Combination #{combo.combinationId}</strong>
                    <label className="text-sm flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={deactivateCombinations.some(
                          (c) => c.combinationId === combo.combinationId
                        )}
                        onChange={(e) =>
                          handleDeactivateCombination(
                            combo.combinationId,
                            e.target.checked
                          )
                        }
                      />
                      Deactivate
                    </label>
                  </div>
                  <div className="pl-4">
                    {combo.options.map((o) => (
                      <span key={o.id} className="block text-sm">
                        {o.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {/* Add new combos */}
              {/* <NotAllowedCombinations
                attributes={productTypeDetails.attributes}
                onChange={setNotAllowedCombinations}
              /> */}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
          disabled={!selectedProductTypeId}
        >
          Create Product
        </button>
      </form>
    </div>
  );
}