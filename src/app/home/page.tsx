"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, ProductsResponse } from "@/types/products";
import { fetchProducts } from "@/lib/api/products-home";

export default function HomePage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  // We'll store the IntersectionObserver itself here
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load products whenever `currentPage` changes
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data: ProductsResponse = await fetchProducts(currentPage);

        // Append new products instead of replacing
        setProducts((prevProducts) => [...prevProducts, ...data.products]);

        // If the backend indicates it's the last page, set the state
        setIsLastPage(data.lastPage);
      } catch (err) {
        setError("Error loading products: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [currentPage]);

  /**
   * IntersectionObserver callback ref:
   * - Attaches to the last product in the list
   * - When it becomes visible, increase `currentPage`.
   */
  const lastProductCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || isLastPage) return;

      // Disconnect any old observer before creating a new one
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // Load the next page
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loading, isLastPage]
  );

  /**
   * Navigate to product details on click.
   */
  function goToProduct(productId: string) {
    router.push(`/product/${productId}`);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Shop Our Products</h1>

      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {products.map((product, index) => {
          // If this is the last product, attach the callback ref
          const isLast = index === products.length - 1;

          return (
            <div
              key={product.id}
              ref={isLast ? lastProductCallback : null}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => goToProduct(product.id)}
            >
              <Image
                src={product.mainPicture}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-500 text-sm">
                {product.description.length > 100
                  ? product.description.substring(0, 100) + "..."
                  : product.description}
              </p>
              <p className="text-primary font-bold text-xl mt-2">
                ${product.price.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <p className="text-center text-gray-500 mt-4">
          Loading more products...
        </p>
      )}
    </div>
  );
}