import { useProductType } from "@/context/product-type-context";
import { addNotAllowedCombinations } from "@/lib/api/product-type-not-allowed";
import {useRouter} from "next/navigation";
import {Attribute, Option} from "@/types/product-types";

export default function Step3NotAllowedComb() {
  const {
    productType,
    notAllowedCombinations,
    setNotAllowedCombinations,
    productTypeId,
    setLoading,
    setError,
  } = useProductType();
  const router = useRouter();

  async function handleSubmit() {
    if (!productTypeId) {
      setError("Error: Product Type ID is missing.");
      return;
    }

    // Ensure each combination has at least two elements
    if (notAllowedCombinations.some((comb) => comb.length < 2)) {
      setError("Each combination must have at least two elements.");
      return;
    }

    setLoading(true);

    try {
      const response = await addNotAllowedCombinations(productTypeId, notAllowedCombinations);
      if (response.status === 200) {
        router.push("/admin/product-types");
      } else {
        setError("Failed to save not-allowed combinations.");
      }
      } catch (err) {
        setError("Error adding not-allowed combinations: " + err);
      } finally {
        setLoading(false);
      }
  }

  function addCombination() {
    setNotAllowedCombinations([
      ...notAllowedCombinations,
      [{ attributeId: 0, attributeOptionId: 0 }],
    ]);
  }

  function addPairToCombination(combIndex: number) {
    const updatedCombinations = [...notAllowedCombinations];
    updatedCombinations[combIndex].push({ attributeId: 0, attributeOptionId: 0 });
    setNotAllowedCombinations(updatedCombinations);
  }

  function removePair(combIndex: number, pairIndex: number) {
    const updatedCombinations = [...notAllowedCombinations];
    updatedCombinations[combIndex].splice(pairIndex, 1);
    setNotAllowedCombinations(updatedCombinations);
  }

  function updatePair(
    combIndex: number,
    pairIndex: number,
    key: "attributeId" | "attributeOptionId",
    value: number
  ) {
    const updatedCombinations = [...notAllowedCombinations];
    updatedCombinations[combIndex][pairIndex] = {
      ...updatedCombinations[combIndex][pairIndex],
      [key]: value,
    };
    setNotAllowedCombinations(updatedCombinations);
  }

  function getDisabledAttributes(combIndex: number): Set<number> {
    return new Set(notAllowedCombinations[combIndex].map((pair) => pair.attributeId));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg"
    >
      {/* Step Title */}
      <h1 className="text-2xl font-bold text-dark mb-6">
        Step 3: Define Not-Allowed Combinations
      </h1>

      {/* Display Product Type Name */}
      {productType && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold">Product Type: {productType.name}</h2>
        </div>
      )}

      {/* Show List of Attributes with Possible Options */}
      {productType?.attributes && productType.attributes.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold">Available Attributes & Options:</h3>
          <ul className="list-disc pl-5">
            {productType.attributes.map((attr: Attribute) => (
              <li key={attr.id} className="mb-2">
                <span className="font-medium">{attr.name}:</span>{" "}
                {attr.options
                  .map((opt: Option) => <span key={opt.id}>{opt.name}</span>)
                  .reduce((prev, curr) => <>{prev}, {curr}</>)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-4">Define Not-Allowed Combinations</h2>

      {notAllowedCombinations.map((comb, combIndex) => {
        const disabledAttributes = getDisabledAttributes(combIndex);

        return (
          <div key={combIndex} className="border p-4 rounded-lg shadow-sm bg-gray-50 mb-4">
            <h3 className="font-medium mb-2">Combination {combIndex + 1}</h3>

            {comb.map((pair, pairIndex) => (
              <div key={pairIndex} className="flex gap-2 mb-2">
                {/* Attribute Selector */}
                <select
                  className="p-2 border rounded-lg w-1/2"
                  value={pair.attributeId || ""}
                  onChange={(e) =>
                    updatePair(combIndex, pairIndex, "attributeId", Number(e.target.value))
                  }
                >
                  <option value="">Select Attribute</option>
                  {productType?.attributes.map((attr: Attribute) => (
                    <option
                      key={attr.id}
                      value={String(attr.id)}
                      disabled={disabledAttributes.has(attr.id) && pair.attributeId !== attr.id}
                    >
                      {attr.name}
                    </option>
                  ))}
                </select>

                {/* Options Selector - Depends on Selected Attribute */}
                <select
                  className="p-2 border rounded-lg w-1/2"
                  value={pair.attributeOptionId || ""}
                  onChange={(e) =>
                    updatePair(combIndex, pairIndex, "attributeOptionId", Number(e.target.value))
                  }
                  disabled={!pair.attributeId}
                >
                  <option value="">Select Option</option>
                  {productType?.attributes
                    .find((attr: {id: number;}) => attr.id === pair.attributeId)
                    ?.options.map((opt: Option) => (
                      <option key={opt.id} value={String(opt.id)}>
                        {opt.name}
                      </option>
                    ))}
                </select>

                {/* Remove Pair Button */}
                {comb.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removePair(combIndex, pairIndex)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}

            {/* Add Pair Button */}
            <button
              type="button"
              onClick={() => addPairToCombination(combIndex)}
              className="mt-2 bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
              disabled={comb.length >= (productType?.attributes?.length || 0)}
            >
              + Add Pair
            </button>
          </div>
        );
      })}

      {/* Add New Combination Button */}
      <button
        type="button"
        onClick={addCombination}
        className="mb-4 bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
      >
        + Add Combination
      </button>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={notAllowedCombinations.some((comb) => comb.length < 2)}
        className="bg-primary text-white px-4 py-2 rounded-lg w-full hover:bg-indigo-700 transition"
      >
        Finish
      </button>
    </form>
  );
}