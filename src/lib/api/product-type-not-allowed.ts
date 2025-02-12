export async function addNotAllowedCombinations(
  productTypeId: string,
  notAllowedCombinations: { attributeId: number; attributeOptionId: number; }[][]
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/product-types/not-allowed-combinations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productTypeId, notAllowedCombinations }),
    }
  );

  return res;
}
