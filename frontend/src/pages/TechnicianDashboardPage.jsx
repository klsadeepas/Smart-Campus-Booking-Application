// TechnicianDashboardPage — accessible only by TECHNICIAN role
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Wrench, CheckCircle, Clock, AlertCircle, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const statusStyle = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-100 text-red-600 border-red-200",
};

const statusIcon = {
  PENDING: <Clock className="h-3.5 w-3.5" />,
  IN_PROGRESS: <AlertCircle className="h-3.5 w-3.5" />,
  COMPLETED: <CheckCircle className="h-3.5 w-3.5" />,
  CANCELLED: <AlertCircle className="h-3.5 w-3.5" />,
};

const mockBookings = [
  { id: "BK-101", resource: "Main Auditorium", requestedBy: "Hasindu Chanuka", date: "2026-04-12", status: "PENDING" },
  { id: "BK-102", resource: "Creative Lab B", requestedBy: "Amali Silva", date: "2026-04-12", status: "IN_PROGRESS" },
  { id: "BK-103", resource: "Conference Room 3", requestedBy: "Kasun Madusanka", date: "2026-04-11", status: "COMPLETED" },
  { id: "BK-104", resource: "Sports Hall", requestedBy: "Nadee Fernando", date: "2026-04-13", status: "PENDING" },
];

const TechnicianDashboardPage = () => {
  const { auth } = useAuth();
  const [bookings, setBookings] = useState(mockBookings);
  const [saving, setSaving] = useState(null);

  const displayName = auth?.fullName || auth?.email || "Technician";

  const handleStatusChange = (id, newStatus) => {
    setSaving(id);
    // Simulates an API call — replace with: axiosInstance.patch(`/api/bookings/${id}/status`, { status: newStatus })
    setTimeout(() => {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      setSaving(null);
    }, 600);
  };

  const summary = {
    pending: bookings.filter((b) => b.status === "PENDING").length,
    inProgress: bookings.filter((b) => b.status === "IN_PROGRESS").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-700 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <p className="text-amber-100 text-xs font-semibold uppercase tracking-widest">Technician Portal</p>
              <h1 className="text-2xl font-black">Welcome back, {displayName}</h1>
            </div>
          </div>
          <p className="text-amber-100 text-sm">Manage and update booking statuses across campus resources</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-5">
          {[
            { label: "Pending", value: summary.pending, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
            { label: "In Progress", value: summary.inProgress, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
            { label: "Completed", value: summary.completed, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-sm font-semibold text-slate-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900">Booking Status Management</h2>
            <p className="text-sm text-slate-500">Update the status of each booking as you process it</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Booking ID</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Resource</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Requested By</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-600">{booking.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{booking.resource}</td>
                    <td className="px-6 py-4 text-slate-500">{booking.requestedBy}</td>
                    <td className="px-6 py-4 text-slate-500">{booking.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle[booking.status]}`}>
                        {statusIcon[booking.status]}
                        {booking.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          disabled={saving === booking.id}
                          className="appearance-none pr-8 pl-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.replace("_", " ")}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 text-slate-400" />
                        {saving === booking.id && (
                          <span className="ml-2 text-xs text-blue-500 animate-pulse">Saving…</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <Link to={ROUTES.HOME} className="text-sm text-slate-400 hover:text-amber-600 transition-colors font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboardPage;
