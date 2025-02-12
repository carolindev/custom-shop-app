import Sidebar from "@/components/admin/Sidebar";
import { ProductTypeProvider } from "@/context/product-type-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 flex-1 p-6">
        <ProductTypeProvider>
          {children}
        </ProductTypeProvider>
      </main>
    </div>
  );
}