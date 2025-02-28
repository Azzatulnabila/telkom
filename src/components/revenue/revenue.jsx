import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";
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
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const RevenueDashboard = () => {
  const [activeTab, setActiveTab] = useState("Revenue");
  const [menuOpen, setMenuOpen] = useState(true);
  const sidebarRef = useRef(null);

  const [trendData, setTrendData] = useState(null);
  const [segmentData, setSegmentData] = useState(null);
  const [prognosaData, setPrognosaData] = useState(null);
  const [ngtmaData, setNgtmaData] = useState(null);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#333",
          font: { size: 14, weight: "bold" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.7)",
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        bodyColor: "#fff",
        padding: 10,
      },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#000",
        font: { size: 14, weight: "bold" },
        formatter: (value) => value.toLocaleString(),
      },
      elements: {
        arc: {
          clip: false,
        },
      },
    },
  };

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/revenue-trend");
        console.log("Data received:", res.data);

        const labels = [...new Set(res.data.map(item => item.segment))];

        setTrendData({
          labels: labels,
          datasets: [
            {
              label: "Revenue",
              data: labels.map(label => 
                res.data.filter(item => item.segment === label)
                  .reduce((sum, item) => sum + Number(item.rev || 0), 0)
              ),
              backgroundColor: "#B22222", 
              borderColor: "#B22222", 
              borderWidth: 2,
              borderRadius: 0,
            },
            {
              label: "Target",
              data: labels.map(label => 
                res.data.filter(item => item.segment === label)
                  .reduce((sum, item) => sum + Number(item.tgt || 0), 0)
              ),
              backgroundColor: "#808080",
              borderColor: "#808080",
              borderWidth: 2,
              borderRadius: 0,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching trend data:", error);
      }
    };

    const fetchSegmentData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/revenue-segment/segmen1");
        console.log("Segment Data received:", res.data);
  
        const labels = res.data.map(item => item.segment);
        const data = res.data.map(item => Number(item.rev || 0));
  
        setSegmentData({
          labels: labels,
          datasets: [
            {
              label: "Revenue",
              data: labels.map(label => 
                res.data.filter(item => item.segment === label)
                  .reduce((sum, item) => sum + Number(item.rev || 0), 0)
              ),
              backgroundColor: "#FFCE56",
              borderColor: "#FFCE56",
              borderWidth: 2,
              borderRadius: 0,
            },
            {
              label: "Target",
              data: labels.map(label => 
                res.data.filter(item => item.segment === label)
                  .reduce((sum, item) => sum + Number(item.tgt || 0), 0)
              ),
              backgroundColor: "#808080",
              borderColor: "#808080",
              borderWidth: 2,
              borderRadius: 0,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching segment data:", error);
      }
    };

    const safeNumber = (value) => {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    };
    
    const calculateTotals = (data, type) => {
      let total = 0; // Total untuk MTD atau YTD
    
      data.forEach((item) => {
        const value = type === "GMOM"
          ? safeNumber(item.afterOGP_gmom)
          : safeNumber(item.afterOGP_gyoy);
    
        total += value;
      });
    
      console.log(`✅ Total ${type}:`, total);
      return total;
    };
    
    const fetchPrognosaData = async () => {
      try {
        const [mtdRes, ytdRes] = await Promise.all([
          axios.get("http://localhost:5000/api/revenue-prognosa/prognosaMtd"),
          axios.get("http://localhost:5000/api/revenue-prognosa/prognosaYtd"),
        ]);
    
        const mtdData = Array.isArray(mtdRes.data) ? mtdRes.data : mtdRes.data.items || [];
        const ytdData = Array.isArray(ytdRes.data) ? ytdRes.data : ytdRes.data.items || [];
    
        const finalMTD = calculateTotals(mtdData, "GMOM");
        const finalYTD = calculateTotals(ytdData, "GYOY");
    
        const newData = {
          labels: ["GMOM", "GYOY"],
          datasets: [
            {
              data: [finalMTD, finalYTD],
              backgroundColor: ["#808080", "#FFCE56"],
              hoverBackgroundColor: ["#808080", "#FFCE56"],
              borderColor: "rgba(128, 128, 128, 1)", // Border normal
              hoverBorderWidth: 12, // Border tebal saat hover
              hoverBorderColor: "rgba(255, 255, 255, 0.5)",
            },
          ],
        };
    
        setPrognosaData(newData);
      } catch (error) {
        console.error("❌ Error fetching prognosa data:", error);
      }
    };

    const fetchNgtmaData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/revenue-ngtma");
        console.log("Segment Data received:", res.data);
  
        const labels = res.data.map(item => item.segment);
        const data = res.data.map(item => Number(item.rev || 0));
  
        setNgtmaData({
          labels: labels,
          datasets: [
            {
              label: "Revenue",
              data: labels.map(label => 
                res.data.filter(item => item.segment === label)
                  .reduce((sum, item) => sum + Number(item.rev || 0), 0)
              ),
              backgroundColor: "#FFCE56",
              borderColor: "#FFCE56",
              borderWidth: 2,
              borderRadius: 0,
            },
            {
              label: "Target",
              data: labels.map(label => 
                res.data.filter(item => item.segment === label)
                  .reduce((sum, item) => sum + Number(item.tgt || 0), 0)
              ),
              backgroundColor: "#808080",
              borderColor: "#808080",
              borderWidth: 2,
              borderRadius: 0,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching segment data:", error);
      }
    };
    
    fetchTrendData();
    fetchSegmentData();
    fetchPrognosaData();
    fetchNgtmaData();
}, []);


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          menuOpen={menuOpen}
          toggleMenu={() => setMenuOpen(!menuOpen)}
        />
      </div>

      <div
        className={`transition-all duration-300 ${menuOpen ? "ml-80 w-[calc(100%-320px)]" : "ml-0 w-full"} flex-1 flex flex-col`}
      >
        {/* Navbar */}
        <Navbar toggleMenu={() => setMenuOpen(!menuOpen)} />
        <main className="flex-1 p-4 bg-gray-100 pt-28">
          <h2 className="text-2xl font-bold mb-4">Revenue Dashboard</h2>
          <div className="grid grid-cols-2 gap-8">
            {[{
                title: "Revenue Trend",
                component: (
                  <Link to="/trend" className="block w-full h-full">
                    {trendData && trendData.labels && trendData.labels.length > 0 ? (
                      <Bar data={trendData} options={chartOptions} />
                    ) : (
                      <p className="text-center">Loading...</p>
                    )}
                  </Link>
                ),
              },
              {
                title: "Revenue Segment", 
                component: (
                  <Link to="/segment" className="block w-full h-full">
                    {segmentData && segmentData.labels && segmentData.labels.length > 0 ? (
                    <Bar data={segmentData} options={chartOptions} />
                    ) : (
                      <p className="text-center">Loading...</p>
                    )}
                  </Link>
                ) 
              },
              {
                title: "Prognosa",
                component: (
                  <Link to="/prognosa" className="block w-full h-full">
                    {prognosaData && prognosaData.datasets?.length > 0 ? (
                    <Pie data={prognosaData} options={chartOptions} />
                    ) : (
                      <p className="text-center">Loading data...</p>
                    )}
                  </Link>
                ),
              },                      
              {
                title: "Ngtma",
                component: (
                  <Link to="/ngtma" className="block w-full h-full">
                    {ngtmaData && ngtmaData.datasets?.length > 0 ? (
                    <Pie data={ngtmaData} options={chartOptions} />
                    ) : (
                      <p className="text-center">Loading data...</p>
                    )}
                  </Link>
                ),
              },                      
          
            ].map((chart, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow h-[400px] relative flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <h2 className="text-lg font-semibold">{chart.title}</h2>
                <div className="flex-1 flex items-center justify-center">
                  {chart.component}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RevenueDashboard;
