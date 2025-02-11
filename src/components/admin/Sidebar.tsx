"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBox, FiSettings } from "react-icons/fi";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-dark text-white fixed left-0 top-0 flex flex-col shadow-lg">
      <div className="p-6 text-lg font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <SidebarItem href="/admin/product-types" icon={<FiSettings />} label="Product Types" active={pathname.startsWith("/admin/product-types")} />
        <SidebarItem href="/admin/products" icon={<FiBox />} label="Products" active={pathname.startsWith("/admin/products")} />
      </nav>
    </aside>
  );
}

function SidebarItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link href={href} className={`flex items-center p-3 rounded-lg transition ${active ? "bg-primary text-white" : "hover:bg-gray-700"}`}>
      <span className="text-lg mr-3">{icon}</span>
      {label}
    </Link>
  );
}