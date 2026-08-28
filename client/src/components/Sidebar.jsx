import {
  LayoutDashboard,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CalendarDays,
  Settings,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";

function Sidebar({
  applicationsCount = 0,
  active = "overview",
  mobileMenu = false,
  setMobileMenu,
  onNavigate,
}) {
  const navigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* MOBILE OVERLAY */}

      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed z-50 left-0 top-0 bottom-0
          w-[255px]
          bg-[#11141b]
          text-white
          flex flex-col
          transition-transform duration-300
          lg:translate-x-0
          ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* MOBILE CLOSE */}

        <button
          type="button"
          onClick={() => setMobileMenu(false)}
          className="absolute right-4 top-5 lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.05]"
        >
          <X size={18} />
        </button>


        {/* LOGO */}

        <div className="px-7 pt-7 pb-8">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">

              <div className="w-5 h-5 rounded-md bg-[#11141b] rotate-45 flex items-center justify-center">

                <div className="w-2.5 h-2.5 bg-white rounded-sm" />

              </div>

            </div>

            <div>

              <h1 className="font-bold text-[19px] tracking-tight">
                JobFlow
              </h1>

              <p className="text-[10px] text-gray-500 uppercase tracking-[0.18em]">
                Workspace
              </p>

            </div>

          </div>

        </div>


        {/* NAVIGATION */}

        <div className="px-4">

          <p className="px-3 mb-3 text-[10px] text-gray-600 uppercase tracking-[0.18em] font-semibold">
            Main menu
          </p>

          <div className="space-y-1">

            <SidebarItem
              active={active === "overview"}
              icon={<LayoutDashboard size={17} />}
              text="Overview"
              onClick={() => navigate("/dashboard")}
            />

            <SidebarItem
              active={active === "applications"}
              icon={<BriefcaseBusiness size={17} />}
              text="Applications"
              badge={applicationsCount}
              onClick={() => navigate("/dashboard")}
            />

            <SidebarItem
              active={active === "analytics"}
              icon={<ChartNoAxesCombined size={17} />}
              text="Analytics"
              onClick={() => navigate("/analytics")}
            />

            <SidebarItem
              active={active === "interviews"}
              icon={<CalendarDays size={17} />}
              text="Interviews"
              onClick={() => navigate("/interviews")}
            />

          </div>

        </div>


        {/* BOTTOM */}

        <div className="mt-auto px-5 pb-5">

          {/* TIP */}

          <div className="rounded-2xl bg-[#191d26] border border-white/[0.05] p-4">

            <div className="flex items-center gap-2 mb-3">

              <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">

                <Sparkles
                  size={14}
                  className="text-white"
                />

              </div>

              <span className="text-xs font-medium">
                JobFlow tip
              </span>

            </div>

            <p className="text-[11px] leading-relaxed text-gray-500">
              Keep your pipeline active. Consistency beats occasional bursts.
            </p>

          </div>


          {/* SETTINGS / LOGOUT */}

          <div className="border-t border-white/[0.06] mt-5 pt-4">

            <SidebarItem
              active={active === "settings"}
              icon={<Settings size={17} />}
              text="Settings"
              onClick={() => navigate("/settings")}
            />

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.04] transition"
            >

              <LogOut size={17} />

              <span className="text-sm">
                Sign out
              </span>

            </button>

          </div>

        </div>

      </aside>
    </>
  );
}


/* ================= SIDEBAR ITEM ================= */

function SidebarItem({
  icon,
  text,
  active = false,
  badge,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-3
        px-3 py-2.5 rounded-xl
        text-sm transition
        ${
          active
            ? "bg-white text-[#171a21]"
            : "text-gray-500 hover:text-white hover:bg-white/[0.04]"
        }
      `}
    >

      {icon}

      <span className="flex-1 text-left">
        {text}
      </span>

      {badge !== undefined && (
        <span className="text-[10px] text-gray-500">
          {badge}
        </span>
      )}

    </button>
  );
}

export default Sidebar;