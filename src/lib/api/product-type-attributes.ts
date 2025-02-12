import { AttributeString } from "@/types/product-types"; 

export async function addAttributes(
  productTypeID: string,
  attributes: AttributeString[]
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/product-types/attributes`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productTypeID, attributes }),
    }
  );

  if (!res.ok) throw new Error("Failed to add attributes");

  return res.json();
}