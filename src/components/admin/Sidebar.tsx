"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 flex flex-col">
      <div className="p-4 text-lg font-bold border-b border-gray-700">Admin Panel</div>
      <nav className="flex-1 p-4">
        <ul>
          <li>
            <Link
              href="/admin/product-types"
              className={`block p-3 rounded-md ${
                pathname.startsWith("/admin/product-types") ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
            >
              Product Types
            </Link>
          </li>
          <li>
            <Link
              href="/admin/products"
              className={`block p-3 rounded-md mt-2 ${
                pathname.startsWith("/admin/products") ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
            >
              Products
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}