import { AttributeString } from "@/types/product-types"; 
import { API_BASE_URL } from "@/config/config"; 

export async function addAttributes(
  productTypeID: string,
  attributes: AttributeString[]
) {
  const res = await fetch(
    `${API_BASE_URL}/v1/admin/product-types/attributes`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productTypeID, attributes }),
    }
  );

  if (!res.ok) throw new Error("Failed to add attributes");

  return res.json();
}