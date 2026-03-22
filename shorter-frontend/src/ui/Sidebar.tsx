import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import type { ReactNode } from "react";

type NavId = string

interface NavItem {
  id: NavId;
  label: string;
  icon: any;
}

const NAV: NavItem[] = [
  { id: "home", label: "Shorten", icon: <svg width="15" height="15"></svg> },
  {
    id: "history",
    label: "All Links",
    icon: <svg width="15" height="15"></svg>,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <svg width="15" height="15"></svg>,
  },
];

interface SidebarProps {
  children: ReactNode;
  active: NavId;
  onNav: (nav: NavId) => void;
}

export const Sidebar = ({ children, active, onNav }: SidebarProps) => {
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const [mob, setMob] = useState(false);
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";
  return (
    <div
      className="flex h-screen bg-[#FAF7F3] overflow-hidden"
      style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}
    >
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col w-52 bg-white border-r border-[#E8E3DA] transition-transform duration-200 ${mob ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}
      >
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#E8E3DA]">
          <div className="w-7 h-7 bg-[#0D0D0D] rounded-lg flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F5F0E8"
              strokeWidth="2.5"
            >
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span
            className="font-semibold text-[#0D0D0D] tracking-tight text-lg"
            style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
          >
            snip
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                onNav(n.id);
                setMob(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left text-sm transition-all duration-100 cursor-pointer ${active === n.id ? "bg-[#0D0D0D] text-[#F5F0E8] font-medium" : "text-[#6B6560] hover:bg-[#F5F0E8] hover:text-[#0D0D0D]"}`}
            >
              {n.icon}
              {n.label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-[#E8E3DA] relative">
          <button
            onClick={() => setMenu(!menu)}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-[#F5F0E8] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 bg-[#0D0D0D] rounded-full flex items-center justify-center text-[#F5F0E8] text-xs font-semibold shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-medium text-[#0D0D0D] truncate">
                {user?.name}
              </p>
              <p className="text-xs text-[#9B9590] truncate">{user?.email}</p>
            </div>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9B9590"
              strokeWidth="2"
              className={`transition-transform flex-shrink-0 ${menu ? "" : "rotate-180"}`}
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          {menu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenu(false)}
              />
              <div className="absolute bottom-16 left-3 right-3 z-20 bg-white border border-[#E8E3DA] rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E8E3DA]">
                  <p className="text-xs font-medium text-[#0D0D0D]">
                    {user?.name}
                  </p>
                  <p className="text-xs text-[#9B9590]">
                    {user?.plan === "pro" ? "⭐ Pro" : "Free plan"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onNav("settings");
                    setMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-[#6B6560] hover:bg-[#F5F0E8] hover:text-[#0D0D0D] transition-colors cursor-pointer"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                  </svg>
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-[#C0392B] hover:bg-[#FBEAE8] transition-colors cursor-pointer"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
      {mob && (
        <div
          className="fixed inset-0 z-20 bg-[#0D0D0D]/40 lg:hidden"
          onClick={() => setMob(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E8E3DA]">
          <button
            onClick={() => setMob(true)}
            className="p-2 text-[#6B6560] cursor-pointer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <span
            className="font-semibold text-[#0D0D0D]"
            style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
          >
            snip
          </span>
          <div className="w-8" />
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
