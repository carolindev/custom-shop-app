import { API_BASE_URL } from "@/config/config";

export async function deleteAdminProduct(productId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/v1/admin/products/${productId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error deleting product: ${text}`);
  }
}
