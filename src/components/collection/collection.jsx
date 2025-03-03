import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import { Line, Bar } from "react-chartjs-2";
import {
  ArcElement,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Daftarkan elemen-elemen Chart.js
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Collection = () => {
  const [activeTab, setActiveTab] = useState("Collection"); // Default active tab
  const [menuOpen, setMenuOpen] = useState(true); // Sidebar state
  const sidebarRef = useRef(null);

  // Data Collection
  const ubisData = {
    labels: ["DGS", "RBS", "DSS", "DPS"],
    datasets: [
      {
        label: "Collection (in Billion)",
        data: [1.2, 0.8, 0.6, 0.4],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
      },
    ],
  };

  const pelangganData = {
    labels: ["Pelanggan A", "Pelanggan B", "Pelanggan C", "Pelanggan D"],
    datasets: [
      {
        label: "Collection (in Billion)",
        data: [0.5, 0.4, 0.3, 0.2],
        backgroundColor: ["#3F51B5", "#FF9800", "#8BC34A", "#FFC107"],
      },
    ],
  };

  // Handle click outside sidebar to close menu
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !event.target.closest("button")) {
            setMenuOpen(false); // Close sidebar when clicking outside
          }
        };
        
        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);
    
        // Cleanup event listener on component unmount
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
      <Sidebar
        ref={sidebarRef}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleMenu={() => setMenuOpen(!menuOpen)}
        menuOpen={menuOpen}
      />
      </div>
      <div className={`transition-all duration-300 ${menuOpen ?"ml-64" : "ml-0"} flex-1 flex flex-col`}
      style={{ transition: "margin 0.3s ease-out, width 0.3s ease-out" }}
      >

        {/* Navbar */}
        <Navbar toggleMenu={() => setMenuOpen(!menuOpen)} />
        <main className="flex-1 p-4 bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">Collection Dashboard</h2>

          {/* Chart UBIS */}
          <div className="transition-all duration-300" style={{ height: "300px", marginBottom: "30px", width: "100%" }}>
            <h3 className="text-xl font-semibold">Collection by UBIS</h3>
            <Bar data={ubisData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>

          {/* Chart Nama Pelanggan */}
          <div className="transition-all duration-300" style={{ height: "300px", marginBottom: "30px", width: "100%" }}>
            <h3 className="text-xl font-semibold">Collection by Customer</h3>
            <Bar data={pelangganData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Collection;
