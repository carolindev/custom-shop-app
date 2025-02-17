"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Product } from "@/types/products";
import { PAGE_SIZE } from "@/config/config";
import { fetchAdminProducts } from "@/lib/api/products";
import {useDeleteProduct} from "@/hooks/use-delete-product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { handleDeleteRequest, loading: deleting, error: deleteError } = useDeleteProduct();

  // Load products whenever `page` changes
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
  }, [page]);

  /**
   * Delete a product by ID
   */
  async function handleDelete(productId: string) {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      // 1. Call the hook's request
      await handleDeleteRequest(productId);

      // 2. If successful, remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== productId));

      // 3. Show success message
      alert("Product deleted successfully!");
    } catch (err) {
      // The hook sets deleteError, so you could rely on that, or do:
      alert((err as Error).message);
    }
  }

  return (
    <div className="ml-64 p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-dark">Products</h1>
        <Link
          href="/admin/products/create"
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <FiPlus /> Create New Product
        </Link>
      </div>

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
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
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
                    <td className="p-4 font-medium text-green-600">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Product"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
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