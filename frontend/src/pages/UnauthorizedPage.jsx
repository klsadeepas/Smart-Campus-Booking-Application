// UnauthorizedPage — shown when a user tries to access a restricted area
import { useNavigate } from "react-router-dom";
import { ShieldX } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../utils/constants";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isTechnician } = useAuth();

  const handleGoBack = () => {
    if (isAdmin) navigate(ROUTES.ADMIN_DASHBOARD);
    else if (isTechnician) navigate(ROUTES.TECHNICIAN_DASHBOARD);
    else navigate(ROUTES.MY_BOOKINGS);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mb-6">
          <ShieldX className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-5xl font-black text-white mb-2">403</h1>
        <h2 className="text-xl font-bold text-slate-300 mb-4">Access Denied</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          You don't have permission to view this page. This area is restricted to a different role.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm"
          >
            Go to my Dashboard
          </button>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors text-sm"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
