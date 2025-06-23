import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
  BarChart2,
  Settings,
  Shield,
  Globe,
  MessageSquare,
  Terminal,
  Wrench,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: PackageSearch,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    name: "MRO",
    href: "/mro",
    icon: Wrench,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
  {
    name: "Communications",
    href: "/communications",
    icon: MessageSquare,
  },
  {
    name: "Console",
    href: "/console",
    icon: Terminal,
  },
  {
    name: "Security",
    href: "/security",
    icon: Shield,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 p-4">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-gray-300 rounded-md hover:text-gray-100 hover:bg-gray-900/50",
              pathname === item.href && "text-blue-400 bg-gray-900/50"
            )}
          >
            <Icon className="w-5 h-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
