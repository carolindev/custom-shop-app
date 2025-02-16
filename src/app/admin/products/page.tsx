"use client";

import { useEffect, useState } from "react";
import { fetchAdminProducts } from "@/lib/api/products";
import { Product } from "@/types/products";
import Image from "next/image";
import { PAGE_SIZE } from "@/config/config"; 

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchAdminProducts(page, PAGE_SIZE);
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError("Error fetching products: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [page]); // Fetch products when the page changes

  return (
    <div className="ml-64 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-dark mb-6">Products</h1>

      {loading && <p className="text-gray-500">Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500">No products available.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="overflow-hidden rounded-lg shadow-lg bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Product Type</th>
                  <th className="p-4">Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-4">
                      <Image
                        src={product.mainPicture}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="p-4 font-semibold">{product.name}</td>
                    <td className="p-4 text-gray-600">{product.sku}</td>
                    <td className="p-4 text-gray-600">{product.productTypeName}</td>
                    <td className="p-4 font-medium text-green-600">${product.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}