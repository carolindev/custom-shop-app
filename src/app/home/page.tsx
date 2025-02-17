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

  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasFetchedPages = useRef(new Set()); // To track fetched pages and avoid duplicates

  // Reset products when coming back to the page
  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setIsLastPage(false);
    hasFetchedPages.current.clear(); // Reset fetched pages
  }, []);

  useEffect(() => {
    async function loadProducts() {
      if (loading || isLastPage || hasFetchedPages.current.has(currentPage)) return;

      setLoading(true);
      try {
        const data: ProductsResponse = await fetchProducts(currentPage);

        setProducts((prevProducts) => {
          const uniqueProducts = new Map([...prevProducts, ...data.products].map(p => [p.id, p]));
          return Array.from(uniqueProducts.values());
        });

        setIsLastPage(data.lastPage);
        hasFetchedPages.current.add(currentPage);
      } catch (err) {
        setError("Error loading products: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [currentPage]);

  const lastProductCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || isLastPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, isLastPage]
  );

  function goToProduct(productId: string) {
    router.push(`/product/${productId}`);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Shop Our Products</h1>

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {products.map((product, index) => {
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

      {loading && (
        <p className="text-center text-gray-500 mt-4">
          Loading more products...
        </p>
      )}
    </div>
  );
}