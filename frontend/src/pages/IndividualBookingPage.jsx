import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import { CheckCircle } from "lucide-react";
import { bookingService } from "../services/bookingService";
import { ROUTES } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

const IndividualBookingPage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    facilityResource: [],
    members: "1",
    durationHours: "1",
    bookingDate: "",
    bookingTime: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFacilityToggle = (resource) => {
    setFormData(prev => {
      const current = prev.facilityResource;
      const updated = current.includes(resource)
        ? current.filter(r => r !== resource)
        : [...current, resource];
      return { ...prev, facilityResource: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    if (formData.facilityResource.length === 0) {
      setError("Please select at least one facility resource.");
      setIsSubmitting(false);
      return;
    }

    const today = new Date();
    const todayStr = today.getFullYear() + '-' + 
                    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(today.getDate()).padStart(2, '0');
    
    if (formData.bookingDate < todayStr) {
      setError("invalid: booking date cannot be in the past");
      setIsSubmitting(false);
      return;
    }

    if (formData.bookingDate === todayStr) {
      const currentTimeInMins = today.getHours() * 60 + today.getMinutes();
      const [bHours, bMins] = formData.bookingTime.split(':').map(Number);
      const bookingTimeInMins = bHours * 60 + bMins;
      
      if (bookingTimeInMins < currentTimeInMins + 20) {
        setError("invalid: booking time must be at least 20 minutes after from current time");
        setIsSubmitting(false);
        return;
      }
    }



    try {
      const payload = {
        resourceId: "INDIVIDUAL",
        resourceName: `Individual Session - ${formData.facilityResource.join(", ")}`,
        userEmail: auth?.email || "anonymous@campus.edu",
        members: parseInt(formData.members, 10),
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        durationHours: parseInt(formData.durationHours, 10),
        durationMinutes: 0,
        message: formData.message
      };
      
      await bookingService.createBooking(payload);
      setSuccess(true);
      
      setTimeout(() => {
        navigate(ROUTES.MY_BOOKINGS);
      }, 3000);
      
    } catch (err) {
      const backendError = err.response?.data?.message || "Failed to create booking. Please try again.";
      setError(backendError);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 border-t border-slate-200">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-emerald-50">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Booking Confirmed!</h2>
            <p className="text-slate-500 mb-8 font-medium">
              Your request was submitted successfully. Our panel inform you to Location Preferences. 
              Redirecting...
            </p>
            <Button fullWidth variant="primary" onClick={() => navigate(ROUTES.MY_BOOKINGS)}>
              View My Bookings Now
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Generate options arrays 
  const memberOptions = Array.from({length: 20}, (_, i) => i + 1);
  const hourOptions = Array.from({length: 10}, (_, i) => i + 1);

  return (
    <MainLayout>
      <section className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 text-white py-16 px-4 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-blue-200 border border-white/20 mb-4 shadow-sm">
              Individual Request
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-sm">
              Individual Bookings
            </h1>
            <p className="text-blue-100/80 text-lg font-medium max-w-xl">
              Complete the quick form below to request facility access precisely tailored to your immediate needs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50 min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"></div>
            
            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center shadow-sm">
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {/* Readonly Auth Email */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Requester Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={auth?.email || ""}
                    readOnly
                    className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-sm font-bold rounded-2xl py-4 px-6 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              {/* Facility Resource / Selected Panel (Multi-select) */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-4 ml-1">
                  Facility Resource / Selected Panel (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Computer Resource",
                    "Project Support Resource",
                    "Wifi Resource",
                    "Normal Resource"
                  ].map((resource) => {
                    const isSelected = formData.facilityResource.includes(resource);
                    return (
                      <div 
                        key={resource}
                        onClick={() => handleFacilityToggle(resource)}
                        className={`relative group cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 ${
                          isSelected 
                            ? "bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500/20" 
                            : "bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold capitalize ${isSelected ? "text-blue-700" : "text-slate-600"}`}>
                            {resource}
                          </span>
                          <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                            isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300 group-hover:border-blue-300"
                          }`}>
                            {isSelected && <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Members Count 1-20 */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2 ml-1">
                    Group Members
                  </label>
                  <div className="relative">
                    <select
                      name="members"
                      value={formData.members}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-slate-300 text-slate-900 text-sm font-bold rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer shadow-sm hover:border-blue-400"
                    >
                      {memberOptions.map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Person' : 'People'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hours 1-10 */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2 ml-1">
                    Duration (Hours)
                  </label>
                  <div className="relative">
                    <select
                      name="durationHours"
                      value={formData.durationHours}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-slate-300 text-slate-900 text-sm font-bold rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer shadow-sm hover:border-blue-400"
                    >
                      {hourOptions.map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Hour' : 'Hours'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2 ml-1">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="bookingDate"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.bookingDate}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-slate-300 text-slate-900 text-sm font-bold rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:border-blue-400 cursor-text"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2 ml-1">
                    Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      name="bookingTime"
                      value={formData.bookingTime}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-slate-300 text-slate-900 text-sm font-bold rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:border-blue-400 cursor-text"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests / Details */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2 ml-1">
                  Special Requests / Details
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm font-bold rounded-2xl py-4 px-6 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:border-blue-400 cursor-text resize-none"
                    placeholder="E.g. Need a specific software installed, or specific accessibility requirements..."
                  ></textarea>
                </div>
                <p className="mt-2 text-xs font-medium text-slate-500 ml-1">Optional: Provide any additional information that might help us prepare for your session.</p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 font-bold px-10 py-4 w-full md:w-auto border-none"
                >
                  {isSubmitting ? "Processing Request..." : "Submit Individual Booking"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default IndividualBookingPage;
