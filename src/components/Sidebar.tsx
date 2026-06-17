import React from "react";
import { LayoutDashboard, Users, CheckSquare, LogOut } from "lucide-react";
import logoImage from "../splash-logo.jpeg";

type Tab = "overview" | "patients" | "corrections" | "reports";

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onLogout: () => void;
  orthophonistName: string;
  clinicName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  orthophonistName
}) => {
  const menuItems = [
    { id: "overview" as Tab, label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "patients" as Tab, label: "قائمة المرضى (الأطفال)", icon: Users },
    { id: "corrections" as Tab, label: "تصحيح التمارين", icon: CheckSquare },
    //{ id: "reports" as Tab, label: "التقارير والتحليلات", icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-white border-l-2 border-tk-border flex flex-col h-screen select-none font-body" dir="rtl">
      {/* Brand Logo */}
      <div className="p-6 border-b-2 border-tk-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white border border-tk-green flex items-center justify-center overflow-hidden">
          <img src={logoImage} className="w-full h-full object-cover" alt="Talky Kids Logo" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-tk-text leading-tight">Talky Kids </h1>
          <p className="text-xs text-tk-textSecondary font-semibold">بوابة أخصائي النطق</p>
        </div>
      </div>

      {/* Orthophonist Info Profile Card */}
      <div className="mx-4 my-6 p-4 bg-tk-greenLight border-2 border-tk-green rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-tk-green flex items-center justify-center text-white font-bold text-lg">
          {orthophonistName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0 text-right">
          <h2 className="font-semibold text-sm text-tk-text truncate">{orthophonistName}</h2>
          <p className="text-xs text-tk-greenDark font-bold truncate">{"أخصائي نطق "}</p>
        </div>
      </div>

      {/* Navigation Menu Links */}
      <nav className="flex-grow px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-150 ${isActive
                ? "bg-tk-blue text-white shadow-neoBlue translate-y-[-2px] border-2 border-tk-blueDark"
                : "text-tk-textSecondary hover:bg-tk-background hover:text-tk-text border-2 border-transparent"
                }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t-2 border-tk-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-tk-red text-tk-red font-bold text-sm bg-tk-redLight/20 hover:bg-tk-redLight transition-all duration-150 button-neo shadow-neoRed active:shadow-[0_2px_0_0]"
        >
          <LogOut size={18} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};
