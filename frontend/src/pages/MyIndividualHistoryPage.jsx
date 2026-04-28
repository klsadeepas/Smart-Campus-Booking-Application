// MyIndividualHistoryPage — Dedicated history for custom facility requests
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import {
  CalendarDays, Clock, MapPin, CheckCircle, XCircle,
  AlertCircle, Plus, Search, Mail
} from "lucide-react";
import { bookingService } from "../services/bookingService";

const STATUS_STYLE = {
  CONFIRMED: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    dot: "bg-emerald-500",
  },
  APPROVED: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    dot: "bg-emerald-500",
  },
  PENDING: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <Clock className="h-3.5 w-3.5" />,
    dot: "bg-amber-500",
  },
  CANCELLED: {
    badge: "bg-red-100 text-red-600 border-red-200",
    icon: <XCircle className="h-3.5 w-3.5" />,
    dot: "bg-red-500",
  },
  IN_PROGRESS: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    dot: "bg-blue-500",
  },
};

const TABS = ["All", "CONFIRMED", "PENDING", "IN_PROGRESS", "CANCELLED"];

const MyIndividualHistoryPage = () => {
  const { auth } = useAuth();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName = auth?.fullName || auth?.email || "Student";

  useEffect(() => {
    if (auth?.email) {
      bookingService.getAllBookings()
        .then(data => {
          // Filter ONLY individual bookings for this user
          const myIndividual = data.filter(b => b.userEmail === auth.email && b.resourceId === "INDIVIDUAL");
          const sorted = myIndividual.sort((a, b) => {
            const dateA = `${a.bookingDate}T${a.bookingTime}`;
            const dateB = `${b.bookingDate}T${b.bookingTime}`;
            return dateB.localeCompare(dateA);
          });
          setBookings(sorted);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch individual history", err);
          setLoading(false);
        });
    }
  }, [auth?.email]);

  const handleCancel = async (booking) => {
    const bookingId = booking.id || booking._id; 
    if (!bookingId) return;
    if (window.confirm("Confirm cancellation of this request?")) {
      try {
        await bookingService.updateBookingStatus(bookingId, "CANCELLED");
        setBookings(prev => 
          prev.map(b => (b.id === bookingId || b._id === bookingId) ? { ...b, status: "CANCELLED" } : b)
        );
      } catch (err) {
        console.error("Failed to cancel request", err);
        alert("Failed to cancel request.");
      }
    }
  };

  const handleSelectLocation = async (bookingId, locationString) => {
    try {
      const updated = await bookingService.updateStudentSelection(bookingId, locationString);
      setBookings(prev => prev.map(b => (b.id === bookingId || b._id === bookingId) ? { ...b, studentSelection: updated.studentSelection } : b));
      alert("Location approved! Administration has been notified of your choice.");
    } catch (err) {
      console.error("Selection failed", err);
      alert("Failed to save selection.");
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.resourceName?.toLowerCase().includes(search.toLowerCase()) ||
      b.id?.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || b.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-0.5">Custom Requests</p>
                <h1 className="text-2xl font-black">My Individual Bookings</h1>
                <p className="text-blue-200 text-sm">{displayName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search your requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${activeTab === tab
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-slate-500 border-slate-200 hover:text-blue-600"
                  }`}
              >
                {tab === "IN_PROGRESS" ? "In Progress" : tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-slate-500 font-medium">Loading your requests...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-20 text-center shadow-sm">
             <CalendarDays className="h-12 w-12 text-slate-300 mx-auto mb-4" />
             <p className="text-lg font-bold text-slate-500">No Individual Requests Found</p>
             <p className="text-sm text-slate-400 mt-1">Submit a new request through the Individual Booking form.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filtered.map((booking) => {
              const style = STATUS_STYLE[booking.status] || STATUS_STYLE.PENDING;
              return (
                <div key={booking.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6 relative overflow-hidden group hover:shadow-xl hover:border-blue-200 transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100/50 transition-colors"></div>
                  
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                        <Plus className="h-7 w-7 text-white" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-black text-slate-900 text-lg">{booking.resourceName}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${style.badge}`}>
                            {style.icon}
                            {(booking.status || "PENDING").replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-bold tracking-tight mb-2">ID: {booking.id}</p>
                        <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl">
                            <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                            {booking.bookingDate}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl">
                            <Clock className="h-3.5 w-3.5 text-blue-500" />
                            {booking.bookingTime} ({booking.durationHours}h)
                          </span>
                        </div>
                      </div>
                    </div>
                    {booking.status !== "CANCELLED" && (
                      <button onClick={() => handleCancel(booking)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 rounded-xl text-[10px] font-black uppercase transition-all self-start sm:self-auto shadow-sm">Cancel Request</button>
                    )}
                  </div>

                  {/* Admin Feedback Panel */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl p-5 border border-blue-100/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center">
                        <MapPin className="h-3.5 w-3.5 text-white" />
                      </div>
                      <h4 className="text-[10px] uppercase font-black text-blue-700 tracking-widest">Administrator Location Suggestions</h4>
                    </div>
                    
                    {booking.status === "APPROVED" && booking.locationSuggestions ? (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-700 font-bold leading-relaxed">
                          Your request has been approved. Please select your preferred physical location from the suggestions below:
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {booking.locationSuggestions.split("; ").map((segment, sIdx) => {
                            const [locationPart, facilityPart] = segment.split(" - Facilities: ");
                            const isSelected = booking.studentSelection === locationPart;
                            const anySelected = !!booking.studentSelection;

                            return (
                              <div key={sIdx} className={`bg-white rounded-2xl border transition-all p-4 shadow-sm flex flex-col justify-between ${isSelected ? "border-emerald-500 ring-4 ring-emerald-50" : "border-blue-100"}`}>
                                <div>
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <span className="bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded">Location</span>
                                      <p className="text-xs font-black text-slate-800">{locationPart}</p>
                                    </div>
                                    {isSelected && (
                                      <span className="bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                                        <CheckCircle className="h-2 w-2" /> Approved
                                      </span>
                                    )}
                                  </div>
                                  {facilityPart && (
                                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-50">
                                      {facilityPart.split(", ").map((fac, fIdx) => (
                                        <span key={fIdx} className="bg-blue-50 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                          <CheckCircle className="h-2.5 w-2.5 text-blue-400" />
                                          {fac}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                <button
                                  disabled={anySelected}
                                  onClick={() => handleSelectLocation(booking.id, locationPart)}
                                  className={`mt-4 w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                    isSelected 
                                      ? "bg-emerald-500 text-white cursor-default" 
                                      : anySelected 
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                        : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100"
                                  }`}
                                >
                                  {isSelected ? "Location Approved" : anySelected ? "Selection Locked" : "Approve This Location"}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[10px] text-blue-500 font-bold italic mt-2 bg-blue-50/50 p-2 rounded-lg border border-dashed border-blue-200 text-center">
                           * You can only approve one location. Once approved, coordinates will be sent to the field staff.
                        </p>

                        {booking.adminNote && (
                          <div className="mt-4 p-4 bg-white rounded-2xl border-2 border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-5 w-5 rounded-md bg-blue-600 flex items-center justify-center">
                                <Mail className="h-3 w-3 text-white" />
                              </div>
                              <h5 className="text-[10px] uppercase font-black text-slate-800 tracking-wider">Instructions From Administration</h5>
                            </div>
                            <p className="text-sm text-slate-600 font-bold italic leading-relaxed pl-7">
                              "{booking.adminNote}"
                            </p>
                          </div>
                        )}
                      </div>
                    ) : booking.status === "REJECTED" ? (
                      <p className="text-xs text-red-500 font-bold italic bg-red-50 p-3 rounded-xl border border-red-100">
                        This specific facility request was not approved. Please reach out to the academic management office for clarification.
                      </p>
                    ) : (
                      <div className="flex items-center gap-3 py-2 bg-amber-50/50 rounded-xl p-3 border border-amber-100/50">
                        <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                        <p className="text-xs text-amber-700 font-bold italic">Our admin panel is currently mapping your requested facilities to available physical slots.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyIndividualHistoryPage;
