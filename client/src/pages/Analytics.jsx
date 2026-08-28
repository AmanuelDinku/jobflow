import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  XCircle,
  TrendingUp,
  Target,
  BarChart3,
} from "lucide-react";

import { fetchApplications } from "../store/applicationsSlice";

import Sidebar from "../components/Sidebar";

function Analytics() {
  const dispatch = useDispatch();

  const [mobileMenu, setMobileMenu] = useState(false);

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

  /* ================= STATISTICS ================= */

  const stats = useMemo(() => {
    const total = applications.length;

    const wishlist = applications.filter(
      (app) => app.status === "wishlist"
    ).length;

    const applied = applications.filter(
      (app) => app.status === "applied"
    ).length;

    const interview = applications.filter(
      (app) => app.status === "interview"
    ).length;

    const offer = applications.filter(
      (app) => app.status === "offer"
    ).length;

    const rejected = applications.filter(
      (app) => app.status === "rejected"
    ).length;

    const responseRate =
      total > 0
        ? Math.round(
            ((interview + offer) / total) * 100
          )
        : 0;

    const interviewRate =
      total > 0
        ? Math.round(
            (interview / total) * 100
          )
        : 0;

    const offerRate =
      total > 0
        ? Math.round(
            (offer / total) * 100
          )
        : 0;

    return {
      total,
      wishlist,
      applied,
      interview,
      offer,
      rejected,
      responseRate,
      interviewRate,
      offerRate,
    };
  }, [applications]);


  /* ================= TOP COMPANIES ================= */

  const topCompanies = useMemo(() => {
    const counts = {};

    applications.forEach((application) => {
      const company = application.company?.trim();

      if (!company) return;

      counts[company] =
        (counts[company] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [applications]);


  /* ================= MONTHLY DATA ================= */

  const monthlyData = useMemo(() => {
    const months = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      months.push({
        month: date.toLocaleString("en-US", {
          month: "short",
        }),

        year: date.getFullYear(),

        count: 0,
      });
    }

    applications.forEach((application) => {
      if (!application.created_at) return;

      const created = new Date(
        application.created_at
      );

      const match = months.find(
        (item) =>
          item.month ===
            created.toLocaleString("en-US", {
              month: "short",
            }) &&
          item.year === created.getFullYear()
      );

      if (match) {
        match.count++;
      }
    });

    return months;
  }, [applications]);


  const maxMonthly =
    Math.max(
      ...monthlyData.map((item) => item.count),
      1
    );


  return (
  <div className="min-h-screen bg-[#f6f7fb] text-[#171a21]">

    <Sidebar
      applicationsCount={applications.length}
      active="analytics"
      mobileMenu={mobileMenu}
      setMobileMenu={setMobileMenu}
    />

    <main className="lg:ml-[255px] min-h-screen">

      {/* ================= HEADER ================= */}

      <header className="h-[76px] bg-white border-b border-[#e9ebf0] px-5 md:px-8 flex items-center">

        <button
          type="button"
          onClick={() => setMobileMenu(true)}
          className="lg:hidden mr-4 w-10 h-10 rounded-xl border border-[#eceef2] bg-white flex items-center justify-center text-gray-500"
        >
  ☰
</button>

        <button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="w-10 h-10 rounded-xl border border-[#eceef2] bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
        >
          <ArrowLeft size={17} />
        </button>

        <div className="ml-4">

          <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-semibold">
            JobFlow
          </p>

          <h1 className="font-bold text-lg tracking-tight">
            Analytics
          </h1>

        </div>

        <div className="ml-auto">

          <div className="w-9 h-9 rounded-full bg-[#171a21] text-white flex items-center justify-center text-xs font-semibold">
            {firstName.charAt(0).toUpperCase()}
          </div>

        </div>

      </header>


      {/* ================= CONTENT ================= */}

        <main className="px-5 md:px-8 py-8 max-w-[1400px] mx-auto">

          {/* HERO */}

          <section className="mb-8">

            <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-400 mb-2">
              Performance overview
            </p>

            <h2 className="text-[32px] md:text-[38px] font-bold tracking-[-0.04em]">
              Your job search,{" "}
              <span className="text-gray-400">
                by the numbers.
              </span>
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Track your progress and understand where your applications are going.
            </p>

          </section>


          {/* ================= STAT CARDS ================= */}

          <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-6">

            <AnalyticsCard
              label="Applications"
              value={stats.total}
              detail="Total opportunities"
              icon={<BriefcaseBusiness size={17} />}
            />

            <AnalyticsCard
              label="Interviews"
              value={stats.interview}
              detail={`${stats.interviewRate}% of applications`}
              icon={<CalendarDays size={17} />}
            />

            <AnalyticsCard
              label="Offers"
              value={stats.offer}
              detail={`${stats.offerRate}% success rate`}
              icon={<Check size={17} />}
            />

            <AnalyticsCard
              label="Response rate"
              value={`${stats.responseRate}%`}
              detail="Interview + offer"
              icon={<TrendingUp size={17} />}
            />

          </section>


          {/* ================= MAIN GRID ================= */}

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-5">


            {/* APPLICATION ACTIVITY */}

            <section className="bg-white border border-[#e6e8ed] rounded-2xl overflow-hidden">

              <div className="px-6 py-5 border-b border-[#eceef2]">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="font-bold text-[17px]">
                      Application activity
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      Applications created over the last six months
                    </p>

                  </div>

                  <div className="w-9 h-9 rounded-xl bg-[#f4f5f7] flex items-center justify-center">
                    <BarChart3 size={17} className="text-gray-500" />
                  </div>

                </div>

              </div>


              {/* CHART */}

              <div className="p-6">

                <div className="h-[280px] flex items-end gap-3 md:gap-6">

                  {monthlyData.map((item) => {

                    const height =
                      (item.count / maxMonthly) * 100;

                    return (

                      <div
                        key={`${item.month}-${item.year}`}
                        className="flex-1 h-full flex flex-col justify-end items-center gap-3"
                      >

                        <div className="text-xs font-semibold text-gray-500">
                          {item.count}
                        </div>

                        <div
                          className="w-full max-w-[55px] bg-[#171a21] rounded-t-xl transition-all"
                          style={{
                            height: `${Math.max(
                              height,
                              item.count > 0 ? 8 : 2
                            )}%`,
                          }}
                        />

                        <span className="text-[10px] text-gray-400">
                          {item.month}
                        </span>

                      </div>

                    );
                  })}

                </div>

              </div>

            </section>


            {/* PIPELINE */}

            <section className="bg-white border border-[#e6e8ed] rounded-2xl p-6">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h3 className="font-bold text-[17px]">
                    Pipeline
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    Current application distribution
                  </p>

                </div>

                <Target
                  size={18}
                  className="text-gray-400"
                />

              </div>


              <PipelineRow
                label="Wishlist"
                value={stats.wishlist}
                total={stats.total}
              />

              <PipelineRow
                label="Applied"
                value={stats.applied}
                total={stats.total}
              />

              <PipelineRow
                label="Interview"
                value={stats.interview}
                total={stats.total}
              />

              <PipelineRow
                label="Offer"
                value={stats.offer}
                total={stats.total}
              />

              <PipelineRow
                label="Rejected"
                value={stats.rejected}
                total={stats.total}
              />

            </section>

          </div>


          {/* ================= BOTTOM GRID ================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">


            {/* TOP COMPANIES */}

            <section className="bg-white border border-[#e6e8ed] rounded-2xl p-6">

              <div className="flex items-center justify-between mb-5">

                <div>

                  <h3 className="font-bold text-[17px]">
                    Top companies
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    Where you're applying most
                  </p>

                </div>

                <BriefcaseBusiness
                  size={18}
                  className="text-gray-400"
                />

              </div>


              {topCompanies.length === 0 ? (

                <p className="text-sm text-gray-400 py-6">
                  No company data yet.
                </p>

              ) : (

                <div className="space-y-4">

                  {topCompanies.map(
                    ([company, count], index) => (

                      <div
                        key={company}
                        className="flex items-center gap-3"
                      >

                        <div className="w-8 h-8 rounded-lg bg-[#f3f4f6] flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">

                          <div className="flex justify-between mb-1">

                            <span className="text-xs font-semibold truncate">
                              {company}
                            </span>

                            <span className="text-[10px] text-gray-400">
                              {count}
                            </span>

                          </div>

                          <div className="h-1.5 bg-[#f0f1f3] rounded-full overflow-hidden">

                            <div
                              className="h-full bg-[#171a21] rounded-full"
                              style={{
                                width: `${
                                  (count /
                                    topCompanies[0][1]) *
                                  100
                                }%`,
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>


            {/* INSIGHT */}

            <section className="bg-[#171a21] rounded-2xl p-6 text-white">

              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold">
                JobFlow insight
              </p>

              <h3 className="text-xl font-bold mt-3">
                {stats.total === 0
                  ? "Start building your pipeline."
                  : stats.responseRate >= 20
                  ? "Your pipeline is showing momentum."
                  : "Keep your pipeline active."
                }
              </h3>

              <p className="text-sm text-gray-400 leading-relaxed mt-3">

                {stats.total === 0
                  ? "Add your first application to start tracking your job search performance."
                  : `You've added ${stats.total} ${
                      stats.total === 1
                        ? "application"
                        : "applications"
                    }. Keep applying consistently and use your interview data to improve your strategy.`
                }

              </p>


              <div className="mt-7 grid grid-cols-2 gap-3">

                <div className="bg-white/[0.05] rounded-xl p-4">

                  <p className="text-[10px] text-gray-500">
                    Interview rate
                  </p>

                  <p className="text-xl font-bold mt-1">
                    {stats.interviewRate}%
                  </p>

                </div>

                <div className="bg-white/[0.05] rounded-xl p-4">

                  <p className="text-[10px] text-gray-500">
                    Offer rate
                  </p>

                  <p className="text-xl font-bold mt-1">
                    {stats.offerRate}%
                  </p>

                </div>

              </div>

            </section>

          </div>

        </main>

      </main>
    
    </div>
  );
}


/* ================= ANALYTICS CARD ================= */

function AnalyticsCard({
  label,
  value,
  detail,
  icon
}) {
  return (
    <div className="bg-white border border-[#e6e8ed] rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <p className="text-xs font-medium text-gray-500">
          {label}
        </p>

        <div className="w-8 h-8 rounded-lg bg-[#f4f5f7] flex items-center justify-center text-gray-500">
          {icon}
        </div>

      </div>

      <h3 className="text-[28px] font-bold tracking-tight mt-4">
        {value}
      </h3>

      <p className="text-[10px] text-gray-400 mt-2">
        {detail}
      </p>

    </div>
  );
}


/* ================= PIPELINE ROW ================= */

function PipelineRow({
  label,
  value,
  total
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div className="mb-5">

      <div className="flex justify-between mb-2">

        <span className="text-xs text-gray-500">
          {label}
        </span>

        <span className="text-xs font-semibold">
          {value}
        </span>

      </div>

      <div className="h-2 bg-[#f0f1f3] rounded-full overflow-hidden">

        <div
          className="h-full bg-[#171a21] rounded-full transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <p className="text-[9px] text-gray-400 mt-1">
        {percentage}% of pipeline
      </p>

    </div>
  );
}

export default Analytics;