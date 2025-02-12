import { useProductType } from "@/context/product-type-context";
import { addAttributes } from "@/lib/api/product-type-attributes";

export default function Step2AddAttributes() {
  const {
    attributes,
    setAttributes,
    productTypeId,
    setProductType,
    setStep,
    setLoading,
    setError,
    loading,
  } = useProductType();

  // Function to add a new attribute
  function handleAddAttribute() {
    setAttributes([...attributes, { attributeName: "", possibleOptions: [""] }]);
  }

  // Function to remove an attribute by index
  function handleRemoveAttribute(index: number) {
    setAttributes(attributes.filter((_, i) => i !== index));
  }

  // Function to update an attribute's name
  function handleUpdateAttributeName(index: number, value: string) {
    const newAttributes = [...attributes];
    newAttributes[index].attributeName = value;
    setAttributes(newAttributes);
  }

  // Function to add an option to a specific attribute
  function handleAddOption(attrIndex: number) {
    const newAttributes = [...attributes];
    newAttributes[attrIndex].possibleOptions.push("");
    setAttributes(newAttributes);
  }

  // Function to remove an option from a specific attribute
  function handleRemoveOption(attrIndex: number, optIndex: number) {
    const newAttributes = [...attributes];
    newAttributes[attrIndex].possibleOptions = newAttributes[attrIndex].possibleOptions.filter(
      (_, i) => i !== optIndex
    );
    setAttributes(newAttributes);
  }

  // Function to update an option's name
  function handleUpdateOptionName(attrIndex: number, optIndex: number, value: string) {
    const newAttributes = [...attributes];
    newAttributes[attrIndex].possibleOptions[optIndex] = value;
    setAttributes(newAttributes);
  }

  // Function to submit attributes
  async function handleSubmit() {
    setLoading(true);
    try {
      const data = await addAttributes(productTypeId!, attributes);
      setProductType(data);
      setStep(3);
    } catch (err) {
      setError("Error: " + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Add Attributes & Options</h2>

      {attributes.map((attribute, attrIndex) => (
        <div key={attrIndex} className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
          {/* Attribute Name */}
          <label className="block text-gray-700 font-medium">Attribute Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg mt-1"
            placeholder="Attribute Name"
            value={attribute.attributeName}
            onChange={(e) => handleUpdateAttributeName(attrIndex, e.target.value)}
            required
          />

          {/* Possible Options */}
          <label className="block text-gray-700 font-medium mt-3">Options</label>
          {attribute.possibleOptions.map((option, optIndex) => (
            <div key={optIndex} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Option Value"
                value={option}
                onChange={(e) => handleUpdateOptionName(attrIndex, optIndex, e.target.value)}
                required
              />
              {/* Remove Option Button */}
              {attribute.possibleOptions.length > 1 && (
                <button
                  type="button"
                  className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                  onClick={() => handleRemoveOption(attrIndex, optIndex)}
                >
                  ✖
                </button>
              )}
            </div>
          ))}

          {/* Add New Option Button */}
          <button
            type="button"
            className="mt-2 bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
            onClick={() => handleAddOption(attrIndex)}
          >
            + Add Option
          </button>

          {/* Remove Attribute Button */}
          {attributes.length > 1 && (
            <button
              type="button"
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 mt-3"
              onClick={() => handleRemoveAttribute(attrIndex)}
            >
              Remove Attribute
            </button>
          )}
        </div>
      ))}

      {/* Add New Attribute Button */}
      <button
        type="button"
        className="mt-4 bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 w-full"
        onClick={handleAddAttribute}
      >
        + Add Attribute
      </button>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition w-full mt-4"
      >
        {loading ? "Saving..." : "Next"}
      </button>
    </form>
  );
}