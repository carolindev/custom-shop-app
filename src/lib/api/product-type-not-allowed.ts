import { API_BASE_URL } from "@/config/config"; 

export async function addNotAllowedCombinations(
  productTypeId: string,
  notAllowedCombinations: { attributeId: number; attributeOptionId: number; }[][]
) {
  const res = await fetch(
    `${API_BASE_URL}/v1/admin/product-types/not-allowed-combinations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productTypeId, notAllowedCombinations }),
    }
  );

  return res;
}
