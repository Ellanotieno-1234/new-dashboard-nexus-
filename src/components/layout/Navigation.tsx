"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// Define nav items with icons and metadata
const navigationItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
  { href: "/inventory", label: "Inventory", icon: "📦" },
  { href: "/orders", label: "Orders", icon: "📝" },
  { href: "/mro", label: "MRO", icon: "🔧" },
  { href: "/communications", label: "Communications", icon: "📱" },
  { href: "/security", label: "Security", icon: "🔒" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-1">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
      
      <div className="pt-4 mt-4 border-t border-gray-200">
        <button className="w-full px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          Export Data
        </button>
      </div>
    </nav>
  )
}
