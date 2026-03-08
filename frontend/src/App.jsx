import { Routes, Route } from "react-router-dom";

import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Profile from "./pages/profile";
import Analyzing from "./pages/Analyzing";
import About from "./pages/About";
import BloodReport from "./pages/BloodReport";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* TOP NAV */}
      <Topbar />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Upload" element={<Upload />} />
          <Route path="/Analyzing" element={<Analyzing />} />
          <Route path="/Auth" element={<Auth />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/About" element={<About />} />
          <Route path="/blood-report" element={<BloodReport />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
