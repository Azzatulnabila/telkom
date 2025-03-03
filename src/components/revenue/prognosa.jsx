import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { FaUpload, FaSearch, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const PROGNOSA = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [columns, setColumns] = useState(["Jan"]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const sidebarRef = useRef(null);


const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const [table1, setTable1] = useState([])
  const [table2, setTable2] = useState([]); 

  const fetchData = async () => {
    try {
      // Jalankan dua request bersamaan
      const [res1, res2] = await Promise.all([
        axios.get("http://localhost:5000/api/revenue-prognosa/prognosaMtd"),
        axios.get("http://localhost:5000/api/revenue-prognosa/prognosaYtd")
      ]);
      console.log("Data Table 1:", res1.data);
      console.log("Data Table 2:", res2.data);

      // Filter data untuk table1
      const filteredTable1 = res1.data?.map(item => ({
        witel: item?.witel || "-",
        beforeOGP: {
          target: Number(item.beforeOGP_target) || 0,
          estSust: Number(item.beforeOGP_estSust) || 0,
          billComp: Number(item.beforeOGP_billComp) || 0,
          ol: Number(item.beforeOGP_ol) || 0,
          ach: item.beforeOGP_ach ? `${item.beforeOGP_ach}` : "-",
        },
        needScaling: item?.needScaling || 0,
        afterOGP: {
          pbAso: Number(item.afterOGP_pbAso) || 0,
          inProg: Number(item.afterOGP_inProg) || 0,
          failed: Number(item.afterOGP_failed) || 0,
          ol: Number(item.afterOGP_ol) || 0,
          ach: item.afterOGP_ach ? `${item.afterOGP_ach}` : "-",
          gmom: item.afterOGP_gmom ? `${item.afterOGP_gmom}` : "-",
        },
        needScalingAfter: item?.needScalingAfter || 0
      })) || [];
      

      // Filter data untuk table2
      const filteredTable2 = res2.data.map(item => ({
        witel: item.witel,
        beforeOGP: {
          target: Number(item.beforeOGP_target) || 0,
          estSust: Number(item.beforeOGP_estSust) || 0,
          billComp: Number(item.beforeOGP_billComp) || 0,
          ol: Number(item.beforeOGP_ol) || 0,
          ach: item.beforeOGP_ach ? `${item.beforeOGP_ach}` : "-",
        },
        needScaling: item.needScaling ? `${item.needScaling}` : "-",
        afterOGP: {
          pbAso: Number(item.afterOGP_pbAso) || 0,
          inProg: Number(item.afterOGP_inProg) || 0,
          failed: Number(item.afterOGP_failed) || 0,
          ol: Number(item.afterOGP_ol) || 0,
          ach: item.afterOGP_ach ? `${item.afterOGP_ach}` : "-",
          gyoy: item.afterOGP_gyoy ? `${item.afterOGP_gyoy}` : "-",
        },
        needScalingAfter: item.needScalingAfter || 0
      }));


      // Set data ke state
      setTable1(filteredTable1);
      setTable2(filteredTable2);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
      fetchData();
    }, []);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
  };

  const handleSearch = () => {
    setLoading(true);
    setProgress(0);
    setShowCalendar(false);
    let percent = 0;
    const interval = setInterval(() => {
      percent += 10;
      setProgress(percent);
      if (percent >= 100) {
        clearInterval(interval);
        setColumns(["Jan", selectedMonth].filter(Boolean));
        setLoading(false);
      }
    }, 200);
  };

  const handleUpload = () => {
    console.log("Upload button clicked");
    // Tambahkan logika upload data di sini
  };
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 ${menuOpen ? "translate-x-0" : "-translate-x-full"} w-64`}
        
      >
        <Sidebar menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      </div>

      <div className={`transition-all duration-300 ${menuOpen ? "ml-0" : "ml-0"} flex-1 flex flex-col ${menuOpen ? "sm:ml-0 md:ml-64" : ""}`}>
      <Navbar toggleMenu={() => setMenuOpen(!menuOpen)} />

        <div className="p-10 mt-20 bg-slate-50 shadow-lg rounded-lg relative w-[95%] mx-auto min-h-[calc(100vh+300px)] ">
          <h1 className="text-2xl font-bold text-center mb-2">Trends Revenue Performance RLEGS - Per Segment</h1>
          <div className="w-full border-t-2 border-gray-300 mb-8"></div>

          <div className="absolute top-[100px] left-13 flex items-center space-x-3">
        </div>
        <button onClick={handleUpload} className="bg-gray-200 p-2 rounded-lg border-2 flex items-center space-x-2 mt-6">
            <FaUpload className="text-gray-700" />
            <span>Upload Data</span>
        </button>

          {/* Table 1 */}
            <div className="overflow-x-auto mt-4">
              <h2 className="text-xl font-bold text-center bg-black text-white p-3 rounded min-w-[1515px]">PROGNOSA REVENUE WITEL KALTIMTARA (MTD)</h2>
              <table className="w-max border-2 border-white text-center">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th rowSpan={2} className="border-4 px-4 py-2">WITEL</th>
                    <th colSpan={5} className="border-4 px-4 py-2">OUTLOOK BEFORE OGP</th>
                    <th rowSpan={2} className="border-4 px-4 py-2">NEED SCALING</th>
                    <th colSpan={6} className="border-4 px-4 py-2">OUTLOOK AFTER OGP</th>
                    <th rowSpan={2} className="border-4 px-4 py-2">NEED SCALING</th>
                  </tr>
                  <tr className="bg-blue-500 text-white">
                    <th className="border-4 px-4 py-2">TARGET</th>
                    <th className="border-4 px-4 py-2">EST SUST</th>
                    <th className="border-4 px-4 py-2">BILL COMP</th>
                    <th className="border-4 px-4 py-2">OL</th>
                    <th className="border-4 px-4 py-2">ACH</th>
                    <th className="border-4 px-4 py-2">PBASO</th>
                    <th className="border-4 px-4 py-2">INPROG</th>
                    <th className="border-4 px-4 py-2">FAILED + SUBMIT + PBA</th>
                    <th className="border-4 px-4 py-2">OL</th>
                    <th className="border-4 px-4 py-2">ACH</th>
                    <th className="border-4 px-4 py-2">GMOM</th>
                  </tr>
                </thead>
                <tbody>
                  {table1.map((row, index) => (
                    <tr key={index} className="bg-blue-100">
                      <td className="border-4 px-4 py-2">{row.witel}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP.target}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP.estSust}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP.billComp}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP.ol}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP.ach}</td>
                      <td className="border-4 px-4 py-2">{row.needScaling}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP.pbAso}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP.inProg}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP.failed}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP.ol}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP.ach}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP.gmom}</td>
                      <td className="border-4 px-4 py-2">{row.needScalingAfter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <hr className="w-full border-t-2 border-gray-300 mt-10" />

            {/* Jarak antar tabel */}
            <div className="mt-4"></div>

            <div className="absolute top-[100px] left-13 flex items-center space-x-3">
            </div>
            <button onClick={handleUpload} className="bg-gray-200 p-2 rounded-lg border-2 flex items-center space-x-2 mt-6">
                <FaUpload className="text-gray-700" />
                <span>Upload Data</span>
            </button>

            {/* Table 2 */}
            <div className="overflow-x-auto mt-4">
            <h2 className="text-xl font-bold text-center bg-black text-white p-3 rounded min-w-[1515px]">PROGNOSA REVENUE WITEL KALTIMTARA (YTD)</h2>
            <table className="w-max border-2 border-white text-center">
                <thead>
                <tr className="bg-blue-500 text-white">
                    <th rowSpan={2} className="border-4 px-4 py-2">WITEL</th>
                    <th colSpan={5} className="border-4 px-4 py-2">OUTLOOK BEFORE OGP</th>
                    <th rowSpan={2} className="border-4 px-4 py-2">NEED SCALING</th>
                    <th colSpan={6} className="border-4 px-4 py-2">OUTLOOK AFTER OGP</th>
                    <th rowSpan={2} className="border-4 px-4 py-2">NEED SCALING</th>
                </tr>
                <tr className="bg-blue-500 text-white">
                    <th className="border-4 px-4 py-2">TARGET</th>
                    <th className="border-4 px-4 py-2">EST SUST</th>
                    <th className="border-4 px-4 py-2">BILL COMP</th>
                    <th className="border-4 px-4 py-2">OL</th>
                    <th className="border-4 px-4 py-2">ACH</th>
                    <th className="border-4 px-4 py-2">PBASO</th>
                    <th className="border-4 px-4 py-2">INPROG</th>
                    <th className="border-4 px-4 py-2">FAILED + SUBMIT + PBA</th>
                    <th className="border-4 px-4 py-2">OL</th>
                    <th className="border-4 px-4 py-2">ACH</th>
                    <th className="border-4 px-4 py-2">GYOY</th>
                </tr>
                </thead>
                <tbody>
                {table2.map((row, index) => (
                    <tr key={index} className="bg-blue-100">
                    <td className="border-4 px-4 py-2">{row.witel}</td>
                    <td className="border-4 px-4 py-2">{row.beforeOGP.target}</td>
                    <td className="border-4 px-4 py-2">{row.beforeOGP.estSust}</td>
                    <td className="border-4 px-4 py-2">{row.beforeOGP.billComp}</td>
                    <td className="border-4 px-4 py-2">{row.beforeOGP.ol}</td>
                    <td className="border-4 px-4 py-2">{row.beforeOGP.ach}</td>
                    <td className="border-4 px-4 py-2">{row.needScaling}</td>
                    <td className="border-4 px-4 py-2">{row.afterOGP.pbAso}</td>
                    <td className="border-4 px-4 py-2">{row.afterOGP.inProg}</td>
                    <td className="border-4 px-4 py-2">{row.afterOGP.failed}</td>
                    <td className="border-4 px-4 py-2">{row.afterOGP.ol}</td>
                    <td className="border-4 px-4 py-2">{row.afterOGP.ach}</td>
                    <td className="border-4 px-4 py-2">{row.afterOGP.gyoy}</td>
                    <td className="border-4 px-4 py-2">{row.needScalingAfter}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PROGNOSA;
