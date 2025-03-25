import { Sidebar } from "@/components/blocks/sidebar/sidebar.component";
import {
  UserRound,
  Store,
  UserRoundCog,
  LayoutDashboard,
  Handshake,
  Code,
  ShoppingCart,
} from "lucide-react";
import { ReactNode } from "react";

export default function UsersLayout({ children }: { children: ReactNode }) {
  const items = [
    {
      id: "main",
      title: "Tableau de bord",
      href: "/admin/main/users/general",
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: "agents",
      title: "Agents",
      href: "/admin/main/users/agents",
      icon: <UserRoundCog size={18} />,
    },
    {
      id: "partners",
      title: "Managers",
      href: "/admin/main/users/managers",
      icon: <Handshake size={18} />,
    },
    {
      id: "pos",
      title: "Points de vente",
      href: "/admin/main/users/pos",
      icon: <Store size={18} />,
    },
    {
      id: "sellers",
      title: "Marchands",
      href: "/admin/main/users/sellers",
      icon: <ShoppingCart size={18} />,
    },
    {
      id: "clients",
      title: "Comptes publics",
      href: "/admin/main/users/clients",
      icon: <UserRound size={18} />,
    },
    {
      id: "api",
      title: "API",
      href: "/admin/main/users/api",
      icon: <Code size={18} />,
    },
  ];

  return (
    <div className="flex h-full bg-background">
      <Sidebar 
        items={items} 
        menuTitle="UTILISATEURS"
      />
      <main className="flex-1 px-6 py-1 overflow-auto">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}