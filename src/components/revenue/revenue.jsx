import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin from "chartjs-plugin-annotation";
import { ArcElement, Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, } from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
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
  const [barData, setBarData] = useState(null);
  const [pieData, setPieData] = useState(null);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: window.innerWidth < 640 ? "top" : "top", // Tetap di atas di semua layar
        align: window.innerWidth < 640 ? "end" : "center", // Pindah ke kanan atas di mobile
        labels: {
          color: "#333",
          font: {
            size: window.innerWidth < 640 ? 10 : 14, // Perkecil di mobile
            weight: "bold",
          },
          boxWidth: window.innerWidth < 640 ? 10 : 10, // Ukuran lebih kecil di mobile
          boxHeight: window.innerWidth < 640 ? 10 : 10, // Kotak tetap di web, bulat di mobile
          usePointStyle: window.innerWidth < 640, // Bulat di mobile, kotak di web
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
        font: { size: window.innerWidth < 640 ? 10 : 12, weight: "bold" },
        formatter: (value) => value.toLocaleString(),
      },
      elements: {
        arc: {
          clip: false,
          borderRadius: window.innerWidth < 640 ? 10 : 20,
        },
        bar: {
          borderRadius: window.innerWidth < 640 ? 5 : 10, 
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
              backgroundColor: "#F06C84",
          
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
        const selectedMonth = localStorage.getItem("selectedMonth") || "2025-01"; // Default ke Januari kalau tidak ada data
        
        const res = await axios.get("http://localhost:5000/api/revenue-segment/segmen1");
        console.log(`Segment Data for ${selectedMonth}:`, res.data);
    
        const labels = [...new Set(res.data.map(item => item.segment))];
    
        setSegmentData({
          labels,
          datasets: [
            {
              label: "Revenue",
              data: labels.map(label => 
                res.data.filter(item => item.segment === label)
                  .reduce((sum, item) => sum + Number(item.rev || 0), 0)
              ),
              backgroundColor: "#F0CCD0",
            },
            {
              label: "Target",
              data: labels.map(label => 
                res.data.filter(item => item.segment === label)
                  .reduce((sum, item) => sum + Number(item.tgt || 0), 0)
              ),
              backgroundColor: "#F06C84",
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
      let total = 0; 
    
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
              borderColor: "rgba(128, 128, 128, 1)", 
              hoverBorderWidth: 12, 
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
    
        console.log("Raw API Data:", res.data);
    
        const filteredData = res.data.map(item => ({
          segment: item.segment,
          ogp: {
            order: Number(item.ogp_order) || 0,
            price: Number(item.ogp_price) || 0,
          },
          mtd: {
            tgt: parseFloat(item.mtd_tgt) || 0,
            billcomp_order: parseFloat(item.mtd_billcomp_order) || 0,
            billcomp_price: parseFloat(item.mtd_billcomp_price) || 0,
            ach: parseFloat(item.mtd_ach) || 0, 
          },
          gmom: parseFloat(item.gmom) || 0, 
          ytd: {
            tgt: parseFloat(item.ytd_tgt) || 0,
            billcomp_order: parseFloat(item.ytd_billcomp_order) || 0,
            billcomp_price: parseFloat(item.ytd_billcomp_price) || 0,
            ach: parseFloat(item.ytd_ach) || 0, 
          },
          gytd: parseFloat(item.gytd) || 0, 
        }));
    
        console.log("Filtered Data:", filteredData);
    
        const totalGmom = filteredData.reduce((sum, row) => sum + row.gmom, 0);
        const totalGytd = filteredData.reduce((sum, row) => sum + row.gytd, 0);
        const totalAch = filteredData.reduce((sum, row) => sum + row.mtd.ach, 0);
    
        console.log("Total GMOM:", totalGmom);
        console.log("Total GYTD:", totalGytd);
        console.log("Total ACH:", totalAch);
      
        const pieData = {
          labels: ["GMOM", "GYTD", "ACH"],
          datasets: [
            {
              data: [totalGmom, totalGytd, totalAch],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        };

        const pieOptions = {
          responsive: true,
          plugins: {
            legend: {
              display: true, 
              position: "bottom", 
              labels: {
                usePointStyle: true, 
                pointStyle: "circle", 
              },
            },
          },
        };
        
        const segments = [...new Set(filteredData.map(item => item.segment))]; 

        const totalOrder = segments.map(segment =>
          filteredData
            .filter(item => item.segment === segment)
            .reduce((sum, row) => sum + (row.ogp.order || 0), 0) 
        );
        
        const totalPrice = segments.map(segment =>
          filteredData
            .filter(item => item.segment === segment)
            .reduce((sum, row) => sum + (row.ogp.price || 0), 0) 
        );        

          const barData = {
            labels: segments, 
            datasets: [
              {
                data: totalOrder,
                backgroundColor: "#F06C84",
              },
              {
                data: totalPrice,
                backgroundColor: "#777475",
              },
            ],
          };

          const barOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 30, 
              },
            },
            scales: {
              x: {
                grid: { display: false }, 
                ticks: { color: "#000" }, 
              },
              y: {
                grid: { drawBorder: false, display: false }, 
                ticks: { display: false }, 
                border: { display: false }, 
              },
            },
            plugins: {
              legend: {
                display: false, 
                position: "top",
              },
            },
          };
          
        console.log("Total Order per Segment:", totalOrder);
        console.log("Total Price per Segment:", totalPrice);
        console.log("Pie Chart Data:", pieData);
        console.log("Bar Chart Data:", barData);
        console.log("Filtered Data:", filteredData);

        setBarData(barData);
        setPieData(pieData);
        setNgtmaData({ pieData, barData, barOptions, pieOptions });
    
      } catch (error) {
        console.error("Error fetching data:", error);
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
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 ${menuOpen ? "translate-x-0" : "-translate-x-full"} w-64 sm:w-64`}
        style={{ position: "fixed", zIndex: 40 }}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          menuOpen={menuOpen}
          toggleMenu={() => setMenuOpen(!menuOpen)}
        />
      </div>

      <div className={`transition-all duration-300 ${menuOpen ? "ml-0" : "ml-0"} flex-1 flex flex-col ${menuOpen ? "sm:ml-0 md:ml-64" : ""}`}>

        {/* Navbar */}
        <Navbar
          toggleMenu={() => setMenuOpen(!menuOpen)}
          menuOpen={menuOpen}
        />

          
        <main className="flex-1 p-4 bg-gray-100 pt-28 overflow-y-scroll no-scrollbar">
          <h2 className="text-2xl font-bold">Revenue Dashboard</h2>
          {/* Grid untuk desktop dan mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-3 sm:p-8">
          {[
            {
              title: "Revenue Trend",
              component: (
                <Link to="/trend" className="w-full h-[150px] sm:h-[320px]">
                  {trendData && trendData.labels?.length > 0 ? (
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
                <Link to="/segment" className="w-full h-[150px] sm:h-[320px]">
                  {segmentData && segmentData.labels?.length > 0 ? (
                    <Bar data={segmentData} options={chartOptions} />
                  ) : (
                    <p className="text-center">Loading...</p>
                  )}
                </Link>
              ),
            },
            {
              title: "Prognosa",
              component: (
                <Link to="/prognosa" className="w-full h-[145px] sm:h-[320px]">
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
                <Link to="/ngtma" className="w-full h-[150px] sm:h-[320px]">
                  {ngtmaData && ngtmaData.pieData && ngtmaData.barData ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex flex-row md:flex-row items-center justify-between w-full max-w-3xl overflow-hidden">
                        {/* Pie Chart (di kiri) */}
                        <div className="w-1/2 flex justify-center mt-4 md:mt-8">
                          <div className="w-full h-[150px] sm:h-[270px]">
                            <Pie
                              data={ngtmaData.pieData}
                              options={{
                                ...ngtmaData.pieOptions,
                                maintainAspectRatio: false,
                              }}
                            />
                          </div>
                        </div>
            
                        {/* Bar Chart (di kanan) */}
                        <div className="w-1/2 flex justify-center">
                          <div className="w-full max-w-sm h-[150px] sm:h-[240px]">
                            <Bar
                              data={ngtmaData.barData}
                              options={{
                                ...ngtmaData.barOptions,
                                maintainAspectRatio: false,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center">Loading data...</p>
                  )}
                </Link>
              ),
            }
            
            
            
            ].map((chart, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow h-[200px] sm:h-[400px] relative flex flex-col transition-transform duration-500 hover:scale-95 hover:shadow-xl"
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