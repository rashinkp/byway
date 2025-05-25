import { cn } from "@/utils/cn";
import { User, BookOpen, Award, Settings, Wallet, Receipt } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Sidebar({
  activeSection,
  setActiveSection,
}: SidebarProps) {
  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "wallet", label: "My Wallet", icon: Wallet },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">User Dashboard</h2>
      </div>
      <nav className="mt-4">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "flex items-center w-full px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors",
              activeSection === item.id && "bg-blue-50 text-blue-600"
            )}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
