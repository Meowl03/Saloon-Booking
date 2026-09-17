"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/appointments", label: "Appointments" },
  { href: "/services", label: "Services" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{ width: 200, background: "#fff", borderRight: "1px solid #e5e7eb" }}
      className="flex flex-col shrink-0 h-full"
    >
      {/* Logo area */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 15, color: "#004a97" }}>
          Salon Booking
        </span>
      </div>

      {/* Nav */}
      <nav style={{ padding: "10px 10px" }} className="flex flex-col gap-0.5">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                padding: "7px 12px",
                borderRadius: 6,
                fontSize: 13.5,
                fontWeight: active ? 600 : 400,
                color: active ? "#004a97" : "#374151",
                background: active ? "#e8f0fa" : "transparent",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active)
                  (e.currentTarget as HTMLElement).style.background = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                if (!active)
                  (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
