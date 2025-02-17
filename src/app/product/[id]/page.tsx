"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { fetchProductById } from "@/lib/api/product-details";
import { fetchAvailableOptions } from "@/lib/api/product-available-options";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { ProductData, ProductAttribute } from "@/types/products";

export default function ProductDetails() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [loadingAttributeId, setLoadingAttributeId] = useState<number | null>(null);

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart, loading: addingToCart, error: cartError } = useAddToCart();

  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      try {
        const data = await fetchProductById(productId);
        setProduct(data);
      } catch (err) {
        setError("Error loading product: " + (err as Error).message);
      } finally {
        setLoadingProduct(false);
      }
    }

    loadProduct();
  }, [productId]);

  /** Called whenever the user selects an option in a dropdown. */
  function handleOptionChange(attributeId: number, optionId: number) {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeId]: optionId,
    }));
  }

  /** Load updated options for a specific attribute on mouse down */
  async function handleDropdownFetch(attribute: ProductAttribute) {
    if (!product) return;
    if (loadingAttributeId === attribute.id) return; 

    try {
      setLoadingAttributeId(attribute.id);

      // Exclude this attribute's own selection from the query
      const selectedOptionIds = Object.entries(selectedOptions)
        .filter(([key]) => Number(key) !== attribute.id)
        .map(([, val]) => val);

      const updatedAttribute = await fetchAvailableOptions(
        productId,
        attribute.id,
        selectedOptionIds.join(",")
      );

      // Merge the new options into the attribute array
      setProduct((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          productAttributes: prev.productAttributes.map((attr) =>
            attr.id === updatedAttribute.attributeId
              ? { ...attr, options: updatedAttribute.options }
              : attr
          ),
        };
      });
    } catch (err) {
      setError("Error loading attribute options: " + (err as Error).message);
    } finally {
      setLoadingAttributeId(null);
    }
  }

  /** True if the user has selected all attributes */
  const allAttributesSelected =
    product?.productAttributes?.every((attr) => selectedOptions[attr.id] !== undefined) ??
    false;

  /**
   * Called when the user clicks "Add to Cart"
   */
  async function handleAddToCart() {
    if (!product) return;

    try {
      await addToCart(productId, selectedOptions, 1);
      router.push("/cart");
    } catch (err) {
      alert((err as Error).message);
    }
  }

  // --- Render ---

  if (loadingProduct) {
    return <p className="text-center text-gray-500">Loading product...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{product?.name}</h1>

        {product?.mainPicture && (
          <div className="mb-4">
            <Image
              src={product.mainPicture}
              alt={product.name}
              width={500}
              height={350}
              className="rounded-lg w-full h-96 object-cover"
            />
          </div>
        )}

        {product?.imageGallery?.length ? (
          <div className="flex gap-3 overflow-x-auto">
            {product.imageGallery.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Gallery Image ${index + 1}`}
                width={100}
                height={75}
                className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
              />
            ))}
          </div>
        ) : null}

        <p className="text-gray-600 mt-4">{product?.description}</p>
        <p className="text-2xl font-bold text-green-600 mt-2">
          ${product?.price.toFixed(2)}
        </p>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Configure Your Product</h3>

          {product?.productAttributes?.map((attribute) => {
            const isLoadingThisDropdown = loadingAttributeId === attribute.id;

            return (
              <div key={attribute.id} className="mb-4">
                <label className="block font-medium text-gray-700">
                  {attribute.name}
                </label>
                <select
                  className="w-full p-2 border rounded-lg mt-1"
                  value={selectedOptions[attribute.id] ?? ""}
                  onChange={(e) => handleOptionChange(attribute.id, Number(e.target.value))}
                  onMouseDown={() => handleDropdownFetch(attribute)}
                >
                  {isLoadingThisDropdown ? (
                    <option value="">
                      Loading {attribute.name}...
                    </option>
                  ) : (
                    <>
                      <option value="">Select {attribute.name}</option>
                      {attribute.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            );
          })}
        </div>

        {/* Show an error if hooking up addToCart fails */}
        {cartError && <p className="text-red-500 mt-2">{cartError}</p>}

        <button
          onClick={handleAddToCart}
          className={`w-full px-4 py-2 rounded-lg text-white mt-4 ${
            allAttributesSelected ? "bg-primary hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!allAttributesSelected || addingToCart}
        >
          {addingToCart ? "Adding to Cart..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}