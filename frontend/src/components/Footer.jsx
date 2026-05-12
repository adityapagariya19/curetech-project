import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10 text-slate-600">
        
        {/* BRAND */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="CureTech" className="h-8 w-8" />
            <span className="text-xl font-bold text-slate-900">CureTech</span>
          </div>
          <p className="text-sm leading-relaxed">
            CureTech helps users understand complex medical reports using
            AI-powered visual insights. Built for clarity, not diagnosis.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/upload" className="hover:text-blue-600">Upload Report</Link></li>
            <li><Link to="/auth" className="hover:text-blue-600">Login / Sign up</Link></li>
            <li><Link to="/About" className="hover:text-blue-600">About Us</Link></li>
          </ul>
        </div>

        {/* DISCLAIMER */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">
            Medical Disclaimer
          </h4>
          <p className="text-sm leading-relaxed">
            CureTech provides AI-assisted insights for educational purposes
            only. It does not replace professional medical advice, diagnosis,
            or treatment.
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500">
        © 2026 CureTech • AI-powered healthcare insights
      </div>
    </footer>
  );
}
