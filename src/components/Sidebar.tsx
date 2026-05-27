import {
  LayoutDashboard,
  Settings,
  ClipboardList,
  Wifi,
  Bell,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  BarChart3} from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (
    page: string
  ) => void;

  collapsed: boolean;
  setCollapsed: (
    value: boolean
  ) => void;
}

export default function Sidebar({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  
}: SidebarProps) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "Supervisor",
      icon: ClipboardList,
    },

    {
  name: "Analytics",
  icon: BarChart3,
    },

    {
      name: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div
      className={`h-screen bg-[#111827] text-white flex flex-col shadow-2xl border-r border-gray-800 transition-all duration-300 ${
        collapsed
          ? "w-24"
          : "w-72"
      }`}
    >
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {/* LOGO */}

          <div className="flex items-center gap-3">
            <div className=" w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
              
              <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
            </div>

            {!collapsed && (
              <div>
                <h1 className="text-[16px] font-bold tracking-wide">
                  Flexi Care Factory
                </h1>

                <p className="text-sm text-gray-400">
                  Production Monitoring
                </p>
              </div>
            )}
          </div>

          {/* TOGGLE */}

          <button
            onClick={() =>
              setCollapsed(
                !collapsed
              )
            }
            className="hover:bg-[#1f2937] p-2 rounded-xl transition-all"
          >
            {collapsed ? (
              <PanelLeftOpen
                size={20}
              />
            ) : (
              <PanelLeftClose
                size={20}
              />
            )}
          </button>
        </div>
      </div>

      {/* ========================= */}
      {/* STATUS */}
      {/* ========================= */}

      {!collapsed && (
        <div className="px-4 py-4 w-[calc(100%-32px)] border-b border-gray-800">
          <div className="bg-[#1f2937] rounded-2xl p-2">
            <div className="flex  items-center justify-between mb-2">
              <span className="text-[10px] text-gray-400">
                System Status
              </span>

              <Wifi
                size={18}
                className="text-green-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

              <span className="font-semibold text-[12px] text-green-400">
                Online
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* MENU */}
      {/* ========================= */}

      <div className="flex-1 px-3 py-5 overflow-y-hidden">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 px-2">
            Navigation
          </p>
        )}

        <div className="space-y-0">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              activePage ===
              item.name;

            return (
              <button
                key={item.name}
                onClick={() =>
                  setActivePage(
                    item.name
                  )
                }
                className={`group w-[calc(100%-1.5rem)] flex items-center ${
                  collapsed
                    ? "justify-center"
                    : "justify-between"
                } px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 shadow-lg shadow-blue-600/30"
                    : "hover:bg-[#1f2937]"
                }`}
              >
                {/* LEFT */}

                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={`${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  />

                  {!collapsed && (
                    <span
                      className={`font-medium ${
                        isActive
                          ? "text-white"
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {item.name}
                    </span>
                  )}
                </div>

                {!collapsed && (
                  <ChevronRight
                    size={16}
                    className={`transition-all duration-300 ${
                      isActive
                        ? "text-white translate-x-1"
                        : "text-gray-500 group-hover:text-white group-hover:translate-x-1"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================= */}
      {/* ALERT */}
      {/* ========================= */}

      {!collapsed && (
        <div className="px-3 pb-5">
          <div className="bg-[#1f2937] rounded-2xl p-1.5 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Bell
                size={18}
                className="text-yellow-400"
              />

              <h3 className="font-semibold">
                Alerts
              </h3>
            </div>

            <p className="text-[10px] text-gray-400">
              No active machine alerts
            </p>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}

      <div className="p-5 border-t border-gray-800">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Flexicare
              </p>

              <p className="text-xs text-gray-500">
                Industrial IoT System
              </p>
            </div>

            <div className="text-xs text-gray-500">
              v1.0
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Menu
              size={20}
              className="text-gray-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}