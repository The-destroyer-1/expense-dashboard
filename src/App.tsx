import { useState } from "react";
import { DashboardProvider } from "./context/DashboardContext";
import { OverviewTab } from "./tabs/OverviewTab";
import { ProductsTab } from "./tabs/ProductsTab";
import { FundsTab } from "./tabs/FundsTab";
import ServicesTab from "./tabs/ServicesTab";
import TruckMakeTab from "./tabs/TruckMakeTab";
import SparesTab from "./tabs/SparesTab";
import AssetsTab from "./tabs/AssetsTab";
import TyresResultTab from "./tabs/TyresResultTab";
import { ReportsTab } from "./tabs/ReportsTab";
import { BarChart3, Package, DollarSign, Menu, X } from "lucide-react";
import { OtherTab } from "./tabs/OtherTab";
import { BackupTab } from "./tabs/BackupTab";
import Login from "./Login";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "funds" | "services" | "reports" | "other" | "truckmake" | "spares" | "assets" | "tyres" | "backup">(
    "overview"
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    {
      id: "overview" as const,
      label: "Overview",
      icon: BarChart3,
      component: OverviewTab,
    },
    {
      id: "products" as const,
      label: "Products",
      icon: Package,
      component: ProductsTab,
    },
    {
      id: "assets" as const,
      label: "Assets",
      icon: Package,
      component: AssetsTab,
    },
    {
      id: "tyres" as const,
      label: "Tyres",
      icon: BarChart3,
      component: TyresResultTab,
    },
    {
      id: "truckmake" as const,
      label: "Truck Makes",
      icon: BarChart3,
      component: TruckMakeTab,
    },
    {
      id: "spares" as const,
      label: "Spares",
      icon: Package,
      component: SparesTab,
    },
    {
      id: "services" as const,
      label: "Services",
      icon: Package,
      component: ServicesTab,
    },
    {
      id: "reports" as const,
      label: "Reports",
      icon: BarChart3,
      component: ReportsTab,
    },
    {
      id: "backup" as const,
      label: "Backup",
      icon: BarChart3,
      component: BackupTab,
    },
    {
      id: "other" as const,
      label: "Other",
      icon: Package,
      component: OtherTab,
    },
    {
      id: "funds" as const,
      label: "Funds",
      icon: DollarSign,
      component: FundsTab,
    },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || OverviewTab;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-bold text-white">
              Expense Dashboard
            </h1>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-2 mt-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                      activeTab === tab.id
                        ? "bg-red-600 text-white"
                        : "text-white hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white p-2 mt-4"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <nav className="md:hidden grid grid-cols-3 gap-2 mt-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMenuOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition font-medium text-sm ${
                      activeTab === tab.id
                        ? "bg-red-600 text-white"
                        : "text-white hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center">
        <ActiveComponent />
      </main>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(
    () => localStorage.getItem("demo_logged_in") === "true"
  );

  // Truck animation removed by user request

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <DashboardProvider>
      <DashboardContent />

      {/* Truck animation and controls removed */}
    </DashboardProvider>
  );
}
