"use client";

import { useEffect, useState } from "react";
import { fetchProductTypes } from "@/lib/api/productTypes";
import Link from "next/link";
import { ProductType } from "@/types/productTypes";

export default function ProductTypesPage() {
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

  if (loading) return <p className="p-4 text-gray-500">Loading product types...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Product Types</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Customization</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productTypes.map((type) => (
            <tr key={type.id} className="border">
              <td className="border p-2">{type.id}</td>
              <td className="border p-2">{type.name}</td>
              <td className="border p-2 capitalize">{type.config.customisation.replace("_", " ")}</td>
              <td className="border p-2">
                <Link href={`/admin/product-types/${type.id}`} className="text-blue-600 hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}