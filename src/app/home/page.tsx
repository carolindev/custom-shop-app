"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Product, ProductsResponse } from "@/types/products";
import { fetchProducts } from "@/lib/api/products-home";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data: ProductsResponse = await fetchProducts(currentPage);
        
        // Append new products instead of replacing
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        setIsLastPage(data.lastPage);
      } catch (err) {
        setError("Error loading products: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [currentPage]);

  // Intersection Observer: Detect when user reaches last product
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Shop Our Products</h1>

      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {products.map((product, index) => (
          <div
            key={product.id}
            ref={index === products.length - 1 ? lastProductCallback : null}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <Image
              src={product.mainPicture}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-500 text-sm">{product.productTypeName}</p>
            <p className="text-primary font-bold text-xl mt-2">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-500 mt-4">Loading more products...</p>}
    </div>
  );
}