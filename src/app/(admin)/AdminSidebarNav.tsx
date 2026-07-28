"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileCheck, 
  GraduationCap,
  Users,
  Calendar,
  Settings
} from "lucide-react";

export default function AdminSidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Data Penerima", href: "/penerima", icon: Users },
    { name: "LPJ Mahasiswa", href: "/evaluasi", icon: FileCheck },
    { name: "Periode & Siklus", href: "/periode", icon: Calendar },
    { name: "Pengaturan Akun", href: "/pengaturan", icon: Settings },
  ];

  return (
    <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
              isActive 
                ? "bg-pipdikti-sky text-white shadow-md shadow-pipdikti-sky/20" 
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-white/70"}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
