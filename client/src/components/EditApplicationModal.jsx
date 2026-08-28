
import { useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateApplication } from "../store/applicationsSlice";

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

export default function EditApplicationModal({
  application,
  onClose,
}) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    company: application.company || "",
    position: application.position || "",
    location: application.location || "",
    status: application.status || "wishlist",
    jobUrl: application.job_url || "",
    salary: application.salary || "",
    appliedDate: application.applied_date
      ? application.applied_date.slice(0, 10)
      : "",
    interviewDate: application.interview_date
      ? application.interview_date.slice(0, 10)
      : "",
    interviewTime: application.interview_time
      ? application.interview_time.slice(0, 5)
      : "",
    interviewType: application.interview_type || "",
    interviewNotes: application.interview_notes || "",
    notes: application.notes || "",
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
        updateApplication({
          id: application.id,
          data: {
            company: formData.company,
            position: formData.position,
            location: formData.location,
            status: formData.status,
            job_url: formData.jobUrl,
            salary: formData.salary,
            applied_date: formData.appliedDate || null,
            interview_date: formData.interviewDate || null,
            interview_time: formData.interviewTime || null,
            interview_type: formData.interviewType || null,
            interview_notes: formData.interviewNotes || null,
            notes: formData.notes,
          },
        })
      ).unwrap();

      alert("Application updated successfully!");
      onClose();
    } catch (error) {
      console.error("Update application error:", error);
      alert(error || "Failed to update application.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}

        <div className="px-6 py-5 border-b border-[#eceef2] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              Edit application
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Update your job application details.
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

        {/* FORM */}

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

          {/* STATUS */}

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

          {/* APPLIED DATE */}

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

          {/* INTERVIEW DETAILS */}

          <div className="pt-2 border-t border-[#eceef2]">

            <div className="mb-4">
              <p className="text-sm font-bold">
                Interview details
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Add details if this application has reached the interview stage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* INTERVIEW DATE */}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Interview date
                </label>

                <input
                  type="date"
                  name="interviewDate"
                  value={formData.interviewDate}
                  onChange={handleChange}
                  className="w-full h-11 border border-[#e3e5e9] rounded-xl px-3 text-sm outline-none bg-white focus:border-[#171a21] transition"
                />
              </div>

              {/* INTERVIEW TIME */}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Interview time
                </label>

                <input
                  type="time"
                  name="interviewTime"
                  value={formData.interviewTime}
                  onChange={handleChange}
                  className="w-full h-11 border border-[#e3e5e9] rounded-xl px-3 text-sm outline-none bg-white focus:border-[#171a21] transition"
                />
              </div>

            </div>

            {/* INTERVIEW TYPE */}

            <div className="mt-4">

              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Interview type
              </label>

              <select
                name="interviewType"
                value={formData.interviewType}
                onChange={handleChange}
                className="w-full h-11 border border-[#e3e5e9] rounded-xl px-3 text-sm outline-none bg-white focus:border-[#171a21] transition"
              >
                <option value="">
                  Select interview type
                </option>

                <option value="Phone">
                  Phone
                </option>

                <option value="Video">
                  Video
                </option>

                <option value="In-person">
                  In-person
                </option>

                <option value="Technical">
                  Technical
                </option>

                <option value="Panel">
                  Panel
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>

            {/* INTERVIEW NOTES */}

            <div className="mt-4">

              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Interview notes
              </label>

              <textarea
                name="interviewNotes"
                value={formData.interviewNotes}
                onChange={handleChange}
                placeholder="Add interview preparation notes, interviewer names, questions, etc."
                rows="4"
                className="w-full border border-[#e3e5e9] rounded-xl px-3 py-3 text-sm outline-none resize-none focus:border-[#171a21] transition placeholder:text-gray-400"
              />

            </div>

          </div>

          {/* GENERAL NOTES */}

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

          {/* BUTTONS */}

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
              Save changes
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

