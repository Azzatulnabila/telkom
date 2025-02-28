import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import "tailwindcss/tailwind.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(true);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  const data = {
    labels: ["Balikpapan", "Kalbar", "Kalselteng", "Kaltimtara"],
    datasets: [
      {
        label: "TARGET",
        data: [4.27, 2.76, 9.02, 7.12],
        backgroundColor: "#facc15",
      },
      {
        label: "REVENUE",
        data: [4.41, 2.53, 9.71, 7.21],
        backgroundColor: "#475569",
      },
    ],
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 ${menuOpen ? "translate-x-0" : "-translate-x-full"} w-64`}
      >
        <Sidebar menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${menuOpen ? "ml-80 w-[calc(100%-320px)]" : "ml-0 w-full"} flex-1 flex flex-col p-6 bg-gray-100 pt-16`}>
        <Navbar toggleMenu={() => setMenuOpen(!menuOpen)} />
        <div className="flex space-x-6 mt-8">
          <div className="w-1/4 bg-gray-900 text-white p-6 space-y-4 rounded-lg">
            <h2 className="text-xl font-bold">📈 RLEGS</h2>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-lg font-semibold">{formattedDate}</p>
              <p className="text-sm">{formattedTime}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-lg font-semibold">23.17 M</p>
              <p className="text-sm">TARGET</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-lg font-semibold">23.86 M</p>
              <p className="text-sm">REALISASI</p>
            </div>
          </div>
          <div className="w-3/4 bg-white text-black p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">RLEGS Revenue Periode YTD January 2025</h2>
            <Bar data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
