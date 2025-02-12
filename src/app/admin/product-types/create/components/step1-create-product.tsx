import { useProductType } from "@/context/product-type-context";
import { createProductType } from "@/lib/api/product-type";
import {useRouter} from "next/navigation";

export default function Step1CreateProduct() {
  const {
    name,
    setName,
    customisation,
    setCustomisation,
    setStep,
    setProductTypeId,
    setLoading,
    setError,
  } = useProductType();
  const router = useRouter();
  
  async function handleSubmit() {
    setLoading(true);
    try {
      const data = await createProductType(name, customisation);
      setProductTypeId(data.productTypeId);

      if (customisation === "not_customizable") {
        router.push("/admin/product-types");
        return;
      }

      setStep(2);
    } catch (err) {
      setError("Error: " + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Name</label>
        <input type="text" className="w-full p-2 border rounded-lg mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Customization</label>
        <select className="w-full p-2 border rounded-lg mt-1" value={customisation} onChange={(e) => setCustomisation(e.target.value)}>
          <option value="fully_customizable">Fully Customizable</option>
          <option value="not_customizable">Not Customizable</option>
        </select>
      </div>

      <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg w-full">
        Next
      </button>
    </form>
  );
}