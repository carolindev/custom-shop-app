"use client";
import { useEffect, useState } from "react";
import { fetchProductTypes } from "@/lib/api/product-types";
import Link from "next/link";
import { ProductType } from "@/types/product-types";
import { FiPlus } from "react-icons/fi";
import { useProductType } from "@/context/product-type-context";

export default function ProductTypesPage() {
  const { reset } = useProductType();
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProductTypes() {
      try {
        const types = await fetchProductTypes();
        setProductTypes(types);
      } catch (err) {
        setError("Failed to load product types: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadProductTypes();
  }, []);

  return (
    <div className="ml-64 p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-dark">Product Types</h1>
        <Link 
          href="/admin/product-types/create"
          onClick={reset}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <FiPlus /> Create Product Type
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading product types...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-hidden rounded-lg shadow-lg bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Customization</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productTypes.map((type) => (
              <tr key={type.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4 text-gray-700">{type.id}</td>
                <td className="p-4 font-semibold">{type.name}</td>
                <td className="p-4 capitalize text-gray-600">{type.config.customisation.replace("_", " ")}</td>
                <td className="p-4 text-center">
                  <Link href={`/admin/product-types/${type.id}`} className="text-primary hover:underline flex justify-center items-center gap-1">
                    {/* <FiEye /> View */}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}