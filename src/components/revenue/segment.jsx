import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import { FaUpload, FaSearch, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const SEGMENT = () => {
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
      axios.get("http://localhost:5000/api/revenue-segment/segmen1"),
      axios.get("http://localhost:5000/api/revenue-segment/segmen2")
    ]);

    console.log("Data Table 1:", res1.data);
    console.log("Data Table 2:", res2.data);

    // Filter data untuk table1
    const filteredTable1 = res1.data.map(item => ({
      segment: item.segment,
      percentage: item.percentage,
      tgt: item.tgt,
      rev: item.rev
    }));

    // Filter data untuk table2
    const filteredTable2 = res2.data.map(item => ({
      segment: item.segment,
      // Data untuk MTD (hanya anak kolom)
      mtd_tgt: Number(item.mtd_tgt) || 0,
      mtd_real: Number(item.mtd_real) || 0,
      mtd_ach: item.mtd_ach ? `${item.mtd_ach}` : "-", // Format persen
      // Data untuk GMOM
      gmom: item.gmom ? `${parseFloat(item.gmom)}` : "-", // Format persen
      // Data untuk YTD (hanya anak kolom)
      ytd_tgt: Number(item.ytd_tgt) || 0,
      ytd_real: Number(item.ytd_real) || 0,
      ytd_ach: item.ytd_ach ? `${item.ytd_ach}` : "-", // Format persen
      // Data untuk GYOY
      gyoy: item.gyoy ? `${parseFloat(item.gyoy)}` : "-" // Hapus %
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
  

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div ref={sidebarRef} className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 ${menuOpen ? "translate-x-0" : "-translate-x-full"} w-64`}>
        <Sidebar menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${menuOpen ? "ml-0" : "ml-0"} flex-1 flex flex-col ${menuOpen ? "sm:ml-0 md:ml-64" : ""}`}>
        <Navbar toggleMenu={() => setMenuOpen(!menuOpen)} />

        <div className="p-10 mt-20 bg-slate-50 shadow-lg rounded-lg relative w-[95%] mx-auto min-h-[calc(100vh+300px)] ">
          <h1 className="text-2xl font-bold text-center mb-2">Trends Revenue Performance RLEGS - Per Segment</h1>
          <div className="w-full border-t-2 border-gray-300 mb-8"></div>

          {/* Periode Picker & Upload Button */}
          <div className="absolute top-[112px] left-13 flex items-center space-x-3">
            <div className="flex flex-col items-start relative">
              <span className="font-bold text-sm mb-1">PERIODE</span>
              <div
                className="flex items-center space-x-10 cursor-pointer bg-gray-200 p-2 rounded-lg border-2"
                onClick={() => setShowCalendar(!showCalendar)}
                style={{ borderColor: selectedMonth ? "blue" : "transparent" }}
              >
                <FaCalendarAlt className="text-gray-700" />
                <span>{selectedMonth ? `${selectedMonth} ${selectedYear}` : "Pilih Bulan"}</span>
              </div>
              {showCalendar && (
                <div className="absolute top-20 bg-white p-4 shadow-lg rounded-lg z-50 w-64">
                  <div className="flex justify-between items-center mb-2">
                    <button onClick={() => setSelectedYear((prev) => prev - 1)} className="text-lg">◀</button>
                    <span className="font-bold">{selectedYear}</span>
                    <button onClick={() => setSelectedYear((prev) => prev + 1)} className="text-lg">▶</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((month) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(month)}
                        className={`p-2 rounded-lg transition-all duration-200 ${selectedMonth === month ? "bg-blue-500 text-white border-2 border-blue-700" : "bg-gray-100"} hover:bg-gray-300`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleSearch} className="bg-black text-white p-2 rounded-lg flex items-center space-x-2 mt-6">
              <FaSearch />
              <span>Search</span>
            </button>
          
            <button onClick={handleUpload} className="bg-gray-200 p-2 rounded-lg border-2 flex items-center space-x-2 mt-6">
              <FaUpload className="text-gray-700" />
              <span>Upload Data</span>
            </button>
          </div>

          {/* Table 1 */}
        <div className="overflow-x-auto mt-28">
          <h2 className="text-xl font-bold text-center bg-black text-white p-3 rounded">REPORT TREG4 REVENUE ACHIEVEMENT (%)</h2>
          <table className="min-w-full border-2 border-white text-center">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th rowSpan={2} className="border-4 px-4 py-2">SEGMENT</th>
                {columns.map((month) => (
                  <th key={month} colSpan="3" className="border-4 px-4 py-2">{month}</th>
                ))}
              </tr>
              <tr className="bg-blue-500 text-white">
              {columns.map((column, index) => (
                <React.Fragment key={index}>
                <th className="border-4 px-4 py-2">PERCENTAGE</th>
                <th className="border-4 px-4 py-2">TGT</th>
                <th className="border-4 px-4 py-2">REV</th>
                </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {table1.length > 0 ? (
                table1.map((row, index) => (
                  <tr key={row.id || index} className="border-2">
                    <td className="border-2 px-4 py-2">{row.segment}</td>
                    {columns.map((month) => (
                      <React.Fragment key={month}>
                        <td className="border-2 px-4 py-2">{row.percentage || "-"}</td>
                        <td className="border-2 px-4 py-2">{row.tgt || "-"}</td>
                        <td className="border-2 px-4 py-2">{row.rev || "-"}</td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length * 3} className="px-4 py-2 text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          <hr className="w-full border-t-2 border-gray-300 mb-10 mt-10" />


        {/* Progress Bar di bawah tabel */}
        {loading && (
            <div className="w-full bottom-10 bg-gray-300 rounded-full h-4 relative ">
              <div className="bg-blue-500 h-4 rounded-full text-white text-xs flex items-center justify-center transition-all duration-200" 
                  style={{ width: `${progress}%` }}>
                {progress}%
              </div>
            </div>
          )}

          {/* Jarak antar tabel */}
          <div className="mt-4"></div>
            {/* Table 2 */}
            <div className="overflow-x-auto mt-[-10px]">
              <h2 className="text-xl font-bold text-center bg-black text-white p-3 rounded">
                REPORT TREG4 REVENUE - SEGMENT RLEGS TANJUNG SELOR
              </h2>
              <table className="min-w-full border-2 border-white text-center">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th rowSpan={2} className="border-4 px-4 py-2">SEGMENT</th>
                    <th colSpan={3} className="border-4 px-4 py-2">MTD</th>
                    <th rowSpan={2} className="border-4 px-4 py-2">GMOM</th>
                    <th colSpan={3} className="border-4 px-4 py-2">YTD</th>
                    <th rowSpan={2} className="border-4 px-4 py-2">GYOY</th>
                  </tr>
                  <tr className="bg-blue-500 text-white">
                    <th className="border-4 px-4 py-2">TGT</th>
                    <th className="border-4 px-4 py-2">REAL</th>
                    <th className="border-4 px-4 py-2">ACH</th>
                    <th className="border-4 px-4 py-2">TGT</th>
                    <th className="border-4 px-4 py-2">REAL</th>
                    <th className="border-4 px-4 py-2">ACH</th>
                  </tr>
                </thead>
                <tbody>
                  {table2.length > 0 ? (
                    table2.map((row, index) => (
                      <tr key={row.id || index} className="border-2">
                        <td className="border-2 px-4 py-2">{row.segment}</td>
                        <td className="border-4 px-4 py-2">{row.mtd_tgt || "-"}</td>
                        <td className="border-4 px-4 py-2">{row.mtd_real || "-"}</td>
                        <td className="border-4 px-4 py-2">{row.mtd_ach || "-"}</td>
                        <td className="border-4 px-4 py-2">{row.gmom || "-"}</td>
                        <td className="border-4 px-4 py-2">{row.ytd_tgt || "-"}</td>
                        <td className="border-4 px-4 py-2">{row.ytd_real || "-"}</td>
                        <td className="border-4 px-4 py-2">{row.ytd_ach || "-"}</td>
                        <td className="border-4 px-4 py-2">{row.gyoy || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="border-4 px-4 py-2">Tidak ada data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SEGMENT;
