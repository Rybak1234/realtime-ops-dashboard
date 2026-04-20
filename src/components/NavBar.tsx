"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import UserMenu from "@/components/UserMenu";
import {
  HiChartBarSquare, HiExclamationTriangle, HiBell, HiShieldCheck,
  HiServerStack, HiUserGroup, HiDocumentText, HiClipboardDocumentList,
  HiBookOpen, HiCog6Tooth, HiWrench, HiBars3, HiXMark,
} from "react-icons/hi2";

const navLinks = [
  { href: "/", label: "Dashboard", icon: HiChartBarSquare },
  { href: "/incidents", label: "Incidencias", icon: HiExclamationTriangle },
  { href: "/alerts", label: "Alertas", icon: HiBell },
  { href: "/sla", label: "SLA", icon: HiShieldCheck },
  { href: "/health", label: "Sistema", icon: HiServerStack },
  { href: "/team", label: "Equipo", icon: HiUserGroup },
  { href: "/reports", label: "Reportes", icon: HiDocumentText },
  { href: "/activity", label: "Actividad", icon: HiClipboardDocumentList },
  { href: "/runbooks", label: "Runbooks", icon: HiBookOpen },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUnreadCount(data.filter((n: { read: boolean }) => !n.read).length);
        }
      })
      .catch(() => {});
  }, [pathname]);

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
            <HiServerStack className="w-5 h-5" /> OpsBoard
          </Link>
          <div className="hidden lg:flex items-center gap-1 text-sm ml-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-md transition ${
                    isActive ? "text-emerald-400 bg-gray-700/50" : "text-gray-400 hover:text-emerald-400 hover:bg-gray-700/30"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Link href="/notifications" className="relative text-gray-400 hover:text-emerald-400 transition">
            <HiBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <Link href="/settings" className="text-gray-400 hover:text-emerald-400 transition hidden sm:block">
            <HiCog6Tooth className="w-5 h-5" />
          </Link>
          {user?.role === "admin" && (
            <Link href="/admin" className="text-gray-400 hover:text-emerald-400 transition hidden sm:block">
              <HiWrench className="w-5 h-5" />
            </Link>
          )}
          <UserMenu />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-gray-400 hover:text-white">
            {mobileOpen ? <HiXMark className="w-5 h-5" /> : <HiBars3 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-gray-800 border-t border-gray-700 px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                  isActive ? "text-emerald-400 bg-gray-700" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" /> {link.label}
              </Link>
            );
          })}
          <Link href="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700">
            <HiCog6Tooth className="w-4 h-4" /> Configuración
          </Link>
          {user?.role === "admin" && (
            <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700">
              <HiWrench className="w-4 h-4" /> Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
