import { Routes, Route } from "react-router-dom";
import Topbar   from "./components/Topbar";
import Footer   from "./components/Footer";
import Landing  from "./pages/Landing";
import Auth     from "./pages/Auth";
import Upload   from "./pages/Upload";
import Profile  from "./pages/profile";
import Analyzing from "./pages/Analyzing";
import About    from "./pages/About";
import ReportPage from "./pages/ReportPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"              element={<Landing />} />
          <Route path="/upload"        element={<Upload />} />
          <Route path="/analyzing"     element={<Analyzing />} />
          <Route path="/auth"          element={<Auth />} />
          <Route path="/profile"       element={<Profile />} />
          <Route path="/about"         element={<About />} />
          {/* All 5 report dashboards share one live component */}
          <Route path="/blood-report"   element={<ReportPage reportType="blood" />} />
          <Route path="/urine-report"   element={<ReportPage reportType="urine" />} />
          <Route path="/liver-report"   element={<ReportPage reportType="liver" />} />
          <Route path="/kidney-report"  element={<ReportPage reportType="kidney" />} />
          <Route path="/thyroid-report" element={<ReportPage reportType="thyroid" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
