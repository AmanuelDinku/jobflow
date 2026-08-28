
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CalendarDays,
  Clock3,
  MapPin,
  BriefcaseBusiness,
  ArrowLeft,
  ExternalLink,
  Search,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import EditApplicationModal from "../components/EditApplicationModal";

import { fetchApplications } from "../store/applicationsSlice";


function Interviews() {

  const dispatch = useDispatch();

  const [editingApplication, setEditingApplication] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");


  const applications = useSelector(
    (state) => state.applications.applications || []
  );


  const user = useSelector(
    (state) => state.auth.user
  );


  useEffect(() => {

    dispatch(fetchApplications());

  }, [dispatch]);


  const firstName =
    user?.name?.split(" ")[0] || "Amanuel";


  /* ================= EDIT ================= */

  const handleEdit = (application) => {

    setEditingApplication(application);

  };


  /* ================= INTERVIEWS ================= */

  const interviews = useMemo(() => {

    const value = search.trim().toLowerCase();


    return applications.filter((application) => {

      const isInterview =
        application.status === "interview";


      if (!isInterview) {
        return false;
      }


      if (!value) {
        return true;
      }


      return (
        application.company
          ?.toLowerCase()
          .includes(value) ||

        application.position
          ?.toLowerCase()
          .includes(value) ||

        application.location
          ?.toLowerCase()
          .includes(value)
      );

    });

  }, [applications, search]);


  return (

    <div className="min-h-screen bg-[#f6f7fb] text-[#171a21]">


      {/* ================= SIDEBAR ================= */}

      <Sidebar
        applicationsCount={applications.length}
        active="interviews"
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />


      {/* ================= MAIN ================= */}

      <main className="lg:ml-[255px] min-h-screen">


        {/* ================= HEADER ================= */}

        <header className="h-[76px] bg-white border-b border-[#e9ebf0] px-5 md:px-8 flex items-center">


          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() => setMobileMenu(true)}
            className="lg:hidden mr-4 w-10 h-10 rounded-xl border border-[#eceef2] bg-white flex items-center justify-center text-gray-500"
          >
            ☰
          </button>


          {/* BACK */}

          <button
            type="button"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="w-10 h-10 rounded-xl border border-[#eceef2] bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
          >
            <ArrowLeft size={17} />
          </button>


          {/* TITLE */}

          <div className="ml-4">

            <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-semibold">
              JobFlow
            </p>

            <h1 className="font-bold text-lg tracking-tight">
              Interviews
            </h1>

          </div>


          {/* USER */}

          <div className="ml-auto">

            <div className="w-9 h-9 rounded-full bg-[#171a21] text-white flex items-center justify-center text-xs font-semibold">

              {firstName.charAt(0).toUpperCase()}

            </div>

          </div>

        </header>


        {/* ================= CONTENT ================= */}

        <div className="px-5 md:px-8 py-8 max-w-[1200px] mx-auto">


          {/* ================= HERO ================= */}

          <section className="mb-8">

            <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-400 mb-2">
              Interview tracker
            </p>


            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">


              <div>

                <h2 className="text-[32px] md:text-[38px] font-bold tracking-[-0.04em]">
                  Your interviews.
                </h2>


                <p className="text-sm text-gray-500 mt-2">
                  Keep track of opportunities that have reached the interview stage.
                </p>

              </div>


              {/* COUNT */}

              <div className="bg-white border border-[#e6e8ed] rounded-2xl px-5 py-4">

                <p className="text-[10px] uppercase tracking-[0.12em] text-gray-400 font-semibold">
                  Total interviews
                </p>


                <p className="text-2xl font-bold mt-1">
                  {interviews.length}
                </p>

              </div>

            </div>

          </section>


          {/* ================= SEARCH ================= */}

          <section className="mb-5">

            <div className="relative max-w-[420px]">

              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />


              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search interviews..."
                className="w-full h-11 bg-white border border-[#e3e5e9] rounded-xl pl-10 pr-4 text-sm outline-none focus:border-[#171a21] transition placeholder:text-gray-400"
              />

            </div>

          </section>


          {/* ================= INTERVIEW LIST ================= */}

          {interviews.length === 0 ? (

            <EmptyState />

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {interviews.map((application) => (

                <InterviewCard
                  key={application.id}
                  application={application}
                  onEdit={handleEdit}
                />

              ))}

            </div>

          )}


          {/* ================= EDIT MODAL ================= */}

          {editingApplication && (

            <EditApplicationModal
              application={editingApplication}
              onClose={() => {
                setEditingApplication(null);
              }}
            />

          )}

        </div>

      </main>

    </div>

  );

}


/* ================================================= */
/*                    INTERVIEW CARD                 */
/* ================================================= */


function InterviewCard({
  application,
  onEdit,
}) {


  const interviewDate =
    application.interview_date

      ? new Date(
          `${application.interview_date}T00:00:00`
        ).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })

      : null;


  const interviewTime =
    application.interview_time

      ? application.interview_time.slice(0, 5)

      : null;


  return (

    <div className="bg-white border border-[#e6e8ed] rounded-2xl p-5 hover:border-[#d1d5db] hover:shadow-[0_5px_20px_rgba(20,25,35,0.05)] transition">


      {/* ================= TOP ================= */}

      <div className="flex items-start justify-between gap-4">


        <div className="flex items-center gap-3 min-w-0">


          <div className="w-11 h-11 rounded-xl bg-[#171a21] text-white flex items-center justify-center flex-shrink-0">

            <BriefcaseBusiness size={18} />

          </div>


          <div className="min-w-0">

            <h3 className="font-bold text-sm truncate">
              {application.position}
            </h3>


            <p className="text-xs text-gray-500 mt-1 truncate">
              {application.company}
            </p>

          </div>

        </div>


        {/* STATUS */}

        <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-semibold">

          <Clock3 size={11} />

          Interview

        </span>

      </div>


      {/* ================= INTERVIEW DETAILS ================= */}

      <div className="mt-5 pt-4 border-t border-[#eef0f3]">


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">


          {/* INTERVIEW DATE */}

          <div className="flex items-center gap-3 bg-[#f8f9fb] rounded-xl p-3">


            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">

              <CalendarDays
                size={15}
                className="text-gray-500"
              />

            </div>


            <div className="min-w-0">

              <p className="text-[9px] uppercase tracking-[0.1em] font-semibold text-gray-400">
                Interview date
              </p>


              <p className="text-xs font-semibold text-gray-700 mt-0.5">

                {interviewDate || "Not scheduled"}

              </p>

            </div>

          </div>


          {/* INTERVIEW TIME */}

          <div className="flex items-center gap-3 bg-[#f8f9fb] rounded-xl p-3">


            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">

              <Clock3
                size={15}
                className="text-gray-500"
              />

            </div>


            <div className="min-w-0">

              <p className="text-[9px] uppercase tracking-[0.1em] font-semibold text-gray-400">
                Interview time
              </p>


              <p className="text-xs font-semibold text-gray-700 mt-0.5">

                {interviewTime || "Not scheduled"}

              </p>

            </div>

          </div>

        </div>


        {/* ================= INTERVIEW TYPE ================= */}

        {application.interview_type && (

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">

            <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-gray-400">
              Type
            </span>


            <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium">

              {application.interview_type}

            </span>

          </div>

        )}


        {/* ================= LOCATION ================= */}

        {application.location && (

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">

            <MapPin
              size={14}
              className="text-gray-400"
            />

            <span>
              {application.location}
            </span>

          </div>

        )}


        {/* ================= APPLIED DATE ================= */}

        {application.applied_date && (

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">

            <CalendarDays
              size={14}
              className="text-gray-400"
            />

            <span>

              Applied{" "}

              {new Date(
                `${application.applied_date}T00:00:00`
              ).toLocaleDateString()}

            </span>

          </div>

        )}


        {/* ================= JOB URL ================= */}

        {application.job_url && (

          <a
            href={application.job_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-blue-600 hover:underline"
          >

            <ExternalLink size={13} />

            View job posting

          </a>

        )}

      </div>


      {/* ================= INTERVIEW NOTES ================= */}

      {application.interview_notes && (

        <div className="mt-4 bg-[#f7f8fa] rounded-xl p-3">

          <p className="text-[10px] uppercase tracking-[0.1em] text-gray-400 font-semibold mb-1">
            Interview notes
          </p>


          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">

            {application.interview_notes}

          </p>

        </div>

      )}


      {/* ================= GENERAL NOTES ================= */}

      {application.notes && (

        <div className="mt-3 bg-[#f7f8fa] rounded-xl p-3">

          <p className="text-[10px] uppercase tracking-[0.1em] text-gray-400 font-semibold mb-1">
            Application notes
          </p>


          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">

            {application.notes}

          </p>

        </div>

      )}


      {/* ================= EDIT BUTTON ================= */}

      <div className="mt-5 pt-4 border-t border-[#eef0f3] flex justify-end">

        <button
          type="button"
          onClick={() => {
            onEdit(application);
          }}
          className="h-9 px-4 rounded-lg bg-[#171a21] text-white text-xs font-medium hover:bg-[#292d36] transition"
        >
          Edit interview
        </button>

      </div>

    </div>

  );

}


/* ================================================= */
/*                     EMPTY STATE                   */
/* ================================================= */


function EmptyState() {

  return (

    <div className="bg-white border border-[#e6e8ed] rounded-2xl p-12 text-center">


      <div className="w-12 h-12 rounded-xl bg-[#f3f4f6] flex items-center justify-center mx-auto">

        <CalendarDays
          size={21}
          className="text-gray-400"
        />

      </div>


      <h3 className="font-semibold text-sm mt-4">
        No interviews yet
      </h3>


      <p className="text-xs text-gray-400 mt-2 max-w-[360px] mx-auto leading-relaxed">

        When you move an application to the Interview stage, it will automatically appear here.

      </p>


      <button
        type="button"
        onClick={() => {
          window.location.href = "/dashboard";
        }}
        className="mt-5 h-10 px-4 rounded-xl bg-[#171a21] text-white text-xs font-medium hover:bg-[#292d36] transition"
      >
        View applications
      </button>

    </div>

  );

}


export default Interviews;

