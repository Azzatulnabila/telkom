import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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

const Sales = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Revenue");
  const sidebarRef = useRef(null);

  // Dummy data for Sales Performance
  const salesPerformanceData = {
    mtd: { target: 50, real: 45, ach: 90 },
    ytd: { target: 500, real: 480, ach: 96 },
  };

  // Sales Trend Data
  const salesTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales Trend",
        data: [40, 50, 45, 55, 60, 65, 70, 75, 80, 85, 90, 100],
        borderColor: "#FF9800",
        backgroundColor: "rgba(255, 152, 0, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Segment Sales Data
  const segmentSalesData = {
    labels: ["Enterprise", "Consumer", "Government"],
    datasets: [
      {
        label: "Sales by Segment",
        data: [50, 30, 20],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  // Prognosa Data
  const prognosaSalesData = {
    labels: ["Realized", "Forecast"],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ["#4CAF50", "#FF9800"],
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
        } w-64 z-40`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          menuOpen={menuOpen}
          toggleMenu={() => setMenuOpen(!menuOpen)}
        />
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${menuOpen ? "ml-64" : "ml-0"} flex-1 flex flex-col`}
      >
        {/* Navbar */}
        <Navbar toggleMenu={() => setMenuOpen(!menuOpen)} />
        <main className="flex-1 p-4 bg-gray-100">
          <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Sales Dashboard</h1>

            {/* Sales Performance */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Sales Performance</h2>
              <p>
                <strong>Month-to-Date (MTD)</strong>: Target: {salesPerformanceData.mtd.target}B,
                Realized: {salesPerformanceData.mtd.real}B, Achievement: {salesPerformanceData.mtd.ach}%
              </p>
              <p>
                <strong>Year-to-Date (YTD)</strong>: Target: {salesPerformanceData.ytd.target}B,
                Realized: {salesPerformanceData.ytd.real}B, Achievement: {salesPerformanceData.ytd.ach}%
              </p>
            </div>

            {/* Sales Trend */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Sales Trend</h2>
              <div style={{ height: "300px" }}>
                <Line data={salesTrendData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Sales by Segment */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Sales by Segment</h2>
              <div style={{ height: "300px" }}>
                <Bar data={segmentSalesData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            {/* Prognosa */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Sales Prognosa</h2>
              <div style={{ height: "300px" }}>
                <Doughnut
                  data={prognosaSalesData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sales;
