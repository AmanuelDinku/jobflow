import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  useDroppable,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CalendarDays,
  Settings,
  LogOut,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  MapPin,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Clock3,
  Check,
  XCircle,
  CircleDashed,
  SlidersHorizontal,
} from "lucide-react";

import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../store/applicationsSlice";
import EditApplicationModal from "../components/EditApplicationModal";

function Dashboard() {
  const dispatch = useDispatch();

  const applications = useSelector(
    (state) => state.applications.applications || []
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleDragEnd = async (event) => {
  const { active, over } = event;

  if (!over) return;

  const applicationId = active.id;
  const newStatus = over.id;

  const validStatuses = [
    "wishlist",
    "applied",
    "interview",
    "offer",
    "rejected",
  ];

  if (!validStatuses.includes(newStatus)) {
    return;
  }

  const application = applications.find(
    (app) => app.id === applicationId
  );

  if (!application) return;

  if (application.status === newStatus) {
    return;
  }

  try {
    await dispatch(
      updateApplication({
        id: applicationId,
        data: {
          company: application.company,
          position: application.position,
          status: newStatus,
          location: application.location,
          salary: application.salary,
          job_url: application.job_url,
          applied_date: application.applied_date,
          notes: application.notes,
        },
      })
    ).unwrap();
  } catch (error) {
    console.error("Failed to move application:", error);
  }
};

  const handleEditApplication = (application) => {
  setSelectedApplication(application);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const firstName =
    user?.name?.split(" ")[0] || "Amanuel";

  const filteredApplications = useMemo(() => {
    if (!search.trim()) return applications;

    const value = search.toLowerCase();

    return applications.filter(
      (app) =>
        app.company?.toLowerCase().includes(value) ||
        app.position?.toLowerCase().includes(value) ||
        app.location?.toLowerCase().includes(value)
    );
  }, [applications, search]);

  const wishlist = filteredApplications.filter(
    (app) => app.status === "wishlist"
  );

  const applied = filteredApplications.filter(
    (app) => app.status === "applied"
  );

  const interview = filteredApplications.filter(
    (app) => app.status === "interview"
  );

  const offer = filteredApplications.filter(
    (app) => app.status === "offer"
  );

  const rejected = filteredApplications.filter(
    (app) => app.status === "rejected"
  );

  const responseRate =
    applications.length > 0
      ? Math.round(
          ((interview.length + offer.length) /
            applications.length) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#171a21]">

      {/* MOBILE OVERLAY */}

      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

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

        {/* LOGO */}

        <div className="px-7 pt-7 pb-8">

          <div className="flex items-center gap-3">

            <div className="relative">

              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">

                <div className="w-5 h-5 rounded-md bg-[#11141b] rotate-45 flex items-center justify-center">

                  <div className="w-2.5 h-2.5 bg-white rounded-sm" />

                </div>

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

            <NavItem
              active
              icon={<LayoutDashboard size={17} />}
              text="Overview"
            />

            <NavItem
              icon={<BriefcaseBusiness size={17} />}
              text="Applications"
              badge={applications.length}
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            />

            <NavItem
              icon={<ChartNoAxesCombined size={17} />}
              text="Analytics"
              onClick={() => {
                window.location.href = "/analytics";
              }}
            />

            <NavItem
              icon={<CalendarDays size={17} />}
              text="Interviews"
            />

          </div>

        </div>


        {/* INSIGHT CARD */}

        <div className="mt-auto px-5 pb-5">

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


          <div className="border-t border-white/[0.06] mt-5 pt-4">

            <NavItem
              icon={<Settings size={17} />}
              text="Settings"
            />

            <button
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


      {/* ================= MAIN ================= */}

      <main className="lg:ml-[255px] min-h-screen">

        {/* HEADER */}

        <header className="h-[76px] bg-white border-b border-[#e9ebf0] px-5 md:px-8 flex items-center">

          <button
            onClick={() => setMobileMenu(true)}
            className="lg:hidden mr-4"
          >
            <Menu size={21} />
          </button>

          {/* SEARCH */}

          <div className="relative w-full max-w-[380px]">

            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search your applications..."
              className="w-full h-10 bg-[#f7f8fa] border border-[#eceef2] rounded-xl pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-[#cfd3dc] transition placeholder:text-gray-400"
            />

          </div>


          <div className="ml-auto flex items-center gap-4">

            <button className="w-10 h-10 rounded-xl border border-[#eceef2] bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 transition">

              <Bell size={17} />

              <span className="absolute mt-[-18px] ml-[15px] w-1.5 h-1.5 rounded-full bg-[#ef4444]" />

            </button>

            <div className="hidden sm:block h-7 w-px bg-[#e9ebf0]" />

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-[#171a21] text-white flex items-center justify-center text-xs font-semibold">

                {firstName.charAt(0).toUpperCase()}

              </div>

              <div className="hidden md:block">

                <p className="text-sm font-semibold">
                  {user?.name || "Amanuel Dinku"}
                </p>

                <p className="text-[11px] text-gray-400">
                  Job seeker
                </p>

              </div>

            </div>

          </div>

        </header>


        {/* CONTENT */}

        <div className="px-5 md:px-8 py-7 max-w-[1500px] mx-auto">


          {/* HERO */}

          <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">

            <div>

              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">

                <span className="w-1.5 h-1.5 rounded-full bg-[#171a21]" />

                Your workspace

              </div>

              <h2 className="text-[32px] md:text-[38px] font-bold tracking-[-0.04em] leading-tight">
                Good morning, {firstName}.
              </h2>

              <p className="text-gray-500 mt-2 text-sm md:text-[15px]">
                Here's a clear view of where your job search stands.
              </p>

            </div>


            <div className="flex gap-2">

              <button className="h-10 px-4 rounded-xl border border-[#e3e5e9] bg-white text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition">

                <SlidersHorizontal size={15} />

                Filter

              </button>

              <button onClick={() => setShowAddModal(true)}
                className="h-10 px-4 rounded-xl bg-[#171a21] text-white text-sm font-medium flex items-center gap-2 hover:bg-[#252933] transition">
                  <Plus size={16} />

                   Add application
              </button>

            </div>

          </section>


          {/* ================= STATISTICS ================= */}

          <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-7">

            <MetricCard
              label="Applications"
              value={applications.length}
              detail="Total submitted"
              icon={<BriefcaseBusiness size={17} />}
            />

            <MetricCard
              label="Interviews"
              value={interview.length}
              detail="Opportunities in progress"
              icon={<CalendarDays size={17} />}
            />

            <MetricCard
              label="Offers"
              value={offer.length}
              detail="Successful outcomes"
              icon={<Check size={17} />}
            />

            <MetricCard
              label="Response rate"
              value={`${responseRate}%`}
              detail="Interview + offer rate"
              icon={<ArrowUpRight size={17} />}
            />

          </section>


          {/* ================= CONTENT GRID ================= */}

          <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_300px] gap-5">


            {/* PIPELINE */}

            <section className="bg-white border border-[#e6e8ed] rounded-2xl shadow-[0_2px_12px_rgba(20,25,35,0.025)] overflow-hidden">

              <div className="px-5 md:px-6 py-5 border-b border-[#eceef2] flex items-center justify-between">

                <div>

                  <h3 className="font-bold text-[17px] tracking-tight">
                    Application pipeline
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    Move opportunities through your workflow
                  </p>

                </div>

                <button className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition">

                  Manage

                  <ChevronRight size={14} />

                </button>

              </div>


              {/* BOARD */}

              <div className="p-4 overflow-x-auto">
                <DndContext collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                >

                  <div className="grid grid-cols-5 gap-3 min-w-[950px]">

                    <Column
                      id="wishlist"
                      title="Wishlist"
                      icon={<CircleDashed size={13} />}
                      applications={wishlist}
                      accent="gray"
                      onEdit={handleEditApplication}
                    />

                    <Column
                      id="applied"
                      title="Applied"
                      icon={<BriefcaseBusiness size={13} />}
                      applications={applied}
                      accent="blue"
                      onEdit={handleEditApplication}
                    />

                    <Column
                      id="interview"
                      title="Interview"
                      icon={<Clock3 size={13} />}
                      applications={interview}
                      accent="orange"
                      onEdit={handleEditApplication}
                    />

                    <Column
                      id="offer"
                      title="Offer"
                      icon={<Check size={13} />}
                      applications={offer}
                      accent="green"
                      onEdit={handleEditApplication}
                    />

                    <Column
                      id="rejected"
                      title="Rejected"
                      icon={<XCircle size={13} />}
                      applications={rejected}
                      accent="red"
                      onEdit={handleEditApplication}
                    />

                  </div>

                </DndContext>

              </div>

            </section>


            {/* RIGHT SIDE */}

            <div className="space-y-5">


              {/* UPCOMING */}

              <section className="bg-[#171a21] rounded-2xl text-white overflow-hidden">

                <div className="p-5">

                  <div className="flex justify-between items-start">

                    <div>

                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold">
                        Next up
                      </p>

                      <h3 className="font-semibold mt-2">
                        Upcoming interviews
                      </h3>

                    </div>

                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">

                      <CalendarDays size={15} />

                    </div>

                  </div>


                  {interview.length === 0 ? (

                    <div className="py-7">

                      <p className="text-sm text-gray-400">
                        No interviews scheduled.
                      </p>

                      <p className="text-[11px] text-gray-600 mt-1">
                        New interviews will appear here.
                      </p>

                    </div>

                  ) : (

                    <div className="mt-5 space-y-2">

                      {interview.slice(0, 3).map(
                        (application) => (
                          <div
                            key={application.id}
                            className="flex items-center gap-3 bg-white/[0.04] rounded-xl p-3"
                          >

                            <div className="w-8 h-8 rounded-lg bg-white/[0.07] flex items-center justify-center">

                              <Clock3 size={14} />

                            </div>

                            <div className="min-w-0">

                              <p className="text-xs font-medium truncate">
                                {application.position}
                              </p>

                              <p className="text-[10px] text-gray-500 truncate mt-0.5">
                                {application.company}
                              </p>

                            </div>

                          </div>
                        )
                      )}

                    </div>

                  )}

                </div>

              </section>


              {/* QUICK STATS */}

              <section className="bg-white border border-[#e6e8ed] rounded-2xl p-5">

                <div className="flex justify-between items-center mb-5">

                  <div>

                    <h3 className="font-semibold text-sm">
                      Search activity
                    </h3>

                    <p className="text-[11px] text-gray-400 mt-1">
                      Current pipeline health
                    </p>

                  </div>

                  <ChartNoAxesCombined
                    size={17}
                    className="text-gray-400"
                  />

                </div>


                <div className="space-y-4">

                  <ProgressRow
                    label="Wishlist"
                    value={wishlist.length}
                    total={Math.max(applications.length, 1)}
                  />

                  <ProgressRow
                    label="Applied"
                    value={applied.length}
                    total={Math.max(applications.length, 1)}
                  />

                  <ProgressRow
                    label="Interview"
                    value={interview.length}
                    total={Math.max(applications.length, 1)}
                  />

                  <ProgressRow
                    label="Offers"
                    value={offer.length}
                    total={Math.max(applications.length, 1)}
                  />

                </div>

              </section>


              {/* MOTIVATION */}

              <section className="border border-[#e6e8ed] bg-[#f0f1f4] rounded-2xl p-5">

                <Sparkles
                  size={18}
                  className="text-[#171a21]"
                />

                <h3 className="font-semibold text-sm mt-3">
                  Stay consistent.
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed mt-2">
                  A strong job search is built one application, follow-up, and interview at a time.
                </p>

              </section>

            </div>

          </div>

        </div>

        {/* ADD APPLICATION MODAL */}

          {showAddModal && (
            <AddApplicationModal
              onClose={() => setShowAddModal(false)}
             />
          )}

          {/* EDIT APPLICATION MODAL */}

          {selectedApplication && (
            <EditApplicationModal
              application={selectedApplication}
              onClose={() => setSelectedApplication(null)}
            />
          )}

      </main>

    </div>
  );
}


/* ================= NAV ITEM ================= */

function NavItem({
  icon,
  text,
  active = false,
  badge,
  onClick
}) {

  return (
    <button
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


/* ================= METRIC CARD ================= */

function MetricCard({
  label,
  value,
  detail,
  icon
}) {

  return (
    <div className="bg-white border border-[#e6e8ed] rounded-2xl p-5 hover:border-[#d5d8de] transition">

      <div className="flex items-center justify-between">

        <p className="text-xs font-medium text-gray-500">
          {label}
        </p>

        <div className="w-8 h-8 rounded-lg bg-[#f4f5f7] flex items-center justify-center text-gray-500">
          {icon}
        </div>

      </div>

      <div className="mt-4 flex items-end justify-between">

        <h3 className="text-[28px] font-bold tracking-tight">
          {value}
        </h3>

      </div>

      <p className="text-[10px] text-gray-400 mt-2">
        {detail}
      </p>

    </div>
  );
}


/* ================= COLUMN ================= */

function Column({
  id,
  title,
  icon,
  applications,
  accent,
  onEdit
}) {

  const {
  setNodeRef,
} = useDroppable({
  id,
});

  const accents = {
    gray: "text-gray-400 bg-gray-100",
    blue: "text-blue-500 bg-blue-50",
    orange: "text-orange-500 bg-orange-50",
    green: "text-emerald-500 bg-emerald-50",
    red: "text-red-500 bg-red-50"
  };

  return (
    <div
      ref={setNodeRef}
      id={id}
      className="bg-[#f8f9fb] rounded-xl border border-[#eef0f3] min-h-[315px]"
    >

      <div className="px-3 py-3 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center ${accents[accent]}`}
          >
            {icon}
          </div>

          <span className="text-[11px] font-semibold">
            {title}
          </span>

        </div>

        <span className="text-[10px] text-gray-400 font-medium">
          {applications.length}
        </span>

      </div>

      <SortableContext
        items={applications.map((application) => application.id)}
        strategy={verticalListSortingStrategy}
>
        <div className="px-2 pb-2 space-y-2">

          {applications.length === 0 ? (

            <div className="border border-dashed border-[#dfe2e7] rounded-lg py-10 text-center">

              <CircleDashed
                size={16}
                className="mx-auto text-gray-300"
              />

              <p className="text-[10px] text-gray-400 mt-2">
                Empty
              </p>

            </div>

          ) : (

            applications.map((application) => (

              <ApplicationCard
                key={application.id}
                application={application}
                onEdit={onEdit}
              />

            ))

          )}

        </div>
      </SortableContext>

    </div>
  );
}


/* ================= APPLICATION CARD ================= */

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </p>

      <p className="text-sm text-gray-700 mt-1 break-words">
        {value}
      </p>
    </div>
  );
}

function ApplicationCard({
  application,
  onEdit
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: application.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const [showView, setShowView] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete ${application.position} at ${application.company}?`
    );

    if (!confirmed) return;

    try {
      await dispatch(
        deleteApplication(application.id)
      ).unwrap();

      setShowMenu(false);

      alert("Application deleted successfully!");

    } catch (error) {
      console.error("Delete application error:", error);

      alert(error || "Failed to delete application.");
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="group relative bg-white border border-[#e7e9ed] rounded-xl p-3 hover:border-[#cfd3da] hover:shadow-[0_5px_15px_rgba(20,25,35,0.06)] transition cursor-pointer"
        onClick={() => onEdit(application)}
      >

        <div className="flex items-start justify-between gap-2">

          <div className="min-w-0">

            <h4 className="text-xs font-semibold truncate">
              {application.position}
            </h4>

            <p className="text-[11px] text-gray-500 mt-1 truncate">
              {application.company}
            </p>

          </div>

          {/* THREE DOT BUTTON */}

          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((previous) => !previous);
            }}
            className="relative z-50 w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 opacity-100 transition"
          >
            <MoreHorizontal size={17} />
          </button>

        </div>


        {application.location && (

          <div className="flex items-center gap-1 mt-3 text-[9px] text-gray-400">

            <MapPin size={10} />

            <span className="truncate">
              {application.location}
            </span>

          </div>

        )}


        {/* ACTION MENU */}

        {showMenu && (
          <div
            className="absolute right-3 top-11 z-[999] w-44 bg-white border border-[#e5e7eb] rounded-xl shadow-2xl p-1 pointer-events-auto"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >

            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onEdit(application);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100 transition"
            >
              ✏️
              <span>Edit application</span>
            </button>


            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                setShowView(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100 transition"
            >
              👁️
              <span>View application</span>
            </button>


            <div className="h-px bg-gray-100 my-1" />


            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 transition"
            >
              🗑️
              <span>Delete application</span>
            </button>

          </div>

        )}

      </div>


      {/* VIEW APPLICATION MODAL */}

      {showView && (

        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowView(false)}
        >

          <div
            className="w-full max-w-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="px-6 py-5 border-b border-[#eceef2] flex items-center justify-between">

              <div>

                <h2 className="text-lg font-bold">
                  {application.position}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {application.company}
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowView(false)}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"
              >
                <X size={18} />
              </button>

            </div>


            <div className="p-6 space-y-4">

              <DetailRow
                label="Company"
                value={application.company}
              />

              <DetailRow
                label="Position"
                value={application.position}
              />

              <DetailRow
                label="Location"
                value={application.location || "Not specified"}
              />

              <DetailRow
                label="Status"
                value={application.status}
              />

              <DetailRow
                label="Salary"
                value={application.salary || "Not specified"}
              />

              <DetailRow
                label="Applied date"
                value={
                  application.applied_date
                    ? new Date(application.applied_date).toLocaleDateString()
                    : "Not specified"
                }
              />

              <DetailRow
                label="Notes"
                value={application.notes || "No notes"}
              />

              {application.job_url && (

                <div>

                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Job URL
                  </p>

                  <a
                    href={application.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {application.job_url}
                  </a>

                </div>

              )}

            </div>


            <div className="px-6 py-4 border-t border-[#eceef2] flex justify-end">

              <button
                type="button"
                onClick={() => setShowView(false)}
                className="h-10 px-5 rounded-xl bg-[#171a21] text-white text-sm font-medium hover:bg-[#292d36]"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}


/* ================= PROGRESS ================= */

function ProgressRow({
  label,
  value,
  total
}) {

  const percentage = Math.min(
    Math.round((value / total) * 100),
    100
  );

  return (
    <div>

      <div className="flex items-center justify-between mb-1.5">

        <span className="text-[11px] text-gray-500">
          {label}
        </span>

        <span className="text-[10px] text-gray-400">
          {value}
        </span>

      </div>

      <div className="h-1.5 bg-[#f0f1f3] rounded-full overflow-hidden">

        <div
          className="h-full bg-[#171a21] rounded-full transition-all"
          style={{
            width: `${percentage}%`
          }}
        />

      </div>

    </div>
  );
}

function AddApplicationModal({ onClose }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    status: "wishlist",
    jobUrl: "",
    salary: "",
    appliedDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await dispatch(
      createApplication({
        company: formData.company,
        position: formData.position,
        location: formData.location,
        status: formData.status,
        job_url: formData.jobUrl,
        salary: formData.salary,
        applied_date: formData.appliedDate,
        notes: formData.notes,
      })
    ).unwrap();

    alert("Application added successfully!");

    onClose();

  } catch (error) {
    console.error("Create application error:", error);

    alert(error);
  }
};

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="px-6 py-5 border-b border-[#eceef2] flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold tracking-tight">
              Add application
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Add a new opportunity to your job search.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
          >
            <X size={18} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <FormField
              label="Company"
              name="company"
              placeholder="e.g. Microsoft"
              value={formData.company}
              onChange={handleChange}
              required
            />

            <FormField
              label="Position"
              name="position"
              placeholder="e.g. Software Engineer"
              value={formData.position}
              onChange={handleChange}
              required
            />

          </div>

          <FormField
            label="Location"
            name="location"
            placeholder="e.g. Seattle, WA / Remote"
            value={formData.location}
            onChange={handleChange}
          />

          <div>

            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-11 border border-[#e3e5e9] rounded-xl px-3 text-sm outline-none bg-white focus:border-[#171a21] transition"
            >

              <option value="wishlist">Wishlist</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>

            </select>

          </div>

          <div>

            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Applied date
            </label>

            <input
              type="date"
              name="appliedDate"
              value={formData.appliedDate}
              onChange={handleChange}
              className="w-full h-11 border border-[#e3e5e9] rounded-xl px-3 text-sm outline-none bg-white focus:border-[#171a21] transition"
            />

          </div>

          <FormField
            label="Job URL"
            name="jobUrl"
            placeholder="https://company.com/jobs/..."
            value={formData.jobUrl}
            onChange={handleChange}
          />

          <FormField
            label="Salary"
            name="salary"
            placeholder="e.g. $90,000 - $120,000"
            value={formData.salary}
            onChange={handleChange}
          />

          <div>

            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes about this opportunity..."
              rows="3"
              className="w-full border border-[#e3e5e9] rounded-xl px-3 py-3 text-sm outline-none resize-none focus:border-[#171a21] transition placeholder:text-gray-400"
            />

          </div>

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-[#e3e5e9] text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#171a21] text-white text-sm font-medium hover:bg-[#292d36] transition"
            >
              Save application
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

  function FormField({
    label,
    name,
    placeholder,
    value,
    onChange,
    required = false,
  }) {
    return (
      <div>

        <label className="block text-xs font-semibold text-gray-600 mb-2">
          {label}
        </label>

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full h-11 border border-[#e3e5e9] rounded-xl px-3 text-sm outline-none focus:border-[#171a21] transition placeholder:text-gray-400"
        />

      </div>
    );
  }

  
  function ApplicationDetailsModal({
  application,
  onClose,
}) {
  const statusStyles = {
    wishlist: "bg-gray-100 text-gray-600",
    applied: "bg-blue-50 text-blue-600",
    interview: "bg-orange-50 text-orange-600",
    offer: "bg-emerald-50 text-emerald-600",
    rejected: "bg-red-50 text-red-600",
  };

  const statusLabels = {
    wishlist: "Wishlist",
    applied: "Applied",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected",
  };

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}

        <div className="px-6 py-5 border-b border-[#eceef2] flex items-start justify-between">

          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-semibold">
              Application details
            </p>

            <h2 className="text-xl font-bold tracking-tight mt-2">
              {application.position}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {application.company}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
          >
            <X size={18} />
          </button>

        </div>

        {/* CONTENT */}

        <div className="p-6 space-y-5">

          {/* STATUS */}

          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Status
            </p>

            <span
              className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold ${
                statusStyles[application.status] ||
                "bg-gray-100 text-gray-600"
              }`}
            >
              {statusLabels[application.status] ||
                application.status}
            </span>
          </div>

          {/* LOCATION */}

          {application.location && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                Location
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin size={15} className="text-gray-400" />
                {application.location}
              </div>
            </div>
          )}

          {/* SALARY */}

          {application.salary && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                Salary
              </p>

              <p className="text-sm text-gray-700">
                {application.salary}
              </p>
            </div>
          )}

          {/* JOB URL */}

          {application.job_url && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                Job posting
              </p>

              <a
                href={application.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View job posting
                <ArrowUpRight size={14} />
              </a>
            </div>
          )}

          {/* NOTES */}

          {application.notes && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                Notes
              </p>

              <div className="bg-[#f7f8fa] rounded-xl p-4">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {application.notes}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}

        <div className="px-6 py-4 border-t border-[#eceef2] flex justify-end">

          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-xl bg-[#171a21] text-white text-sm font-medium hover:bg-[#292d36] transition"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
  }

  
export default Dashboard;