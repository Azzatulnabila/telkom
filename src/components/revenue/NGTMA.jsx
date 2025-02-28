import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

const NGTMAReport = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [columns, setColumns] = useState(["Jan"]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const sidebarRef = useRef(null);
  const [isPeriodSelected, setIsPeriodSelected] = useState(false);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const [data, setData] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "" });

  // GET: Mengambil data
const fetchData = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/revenue-ngtma");
    console.log("Data received:", res.data); // Periksa data yang diterima

    // Hanya ambil data yang sesuai dengan struktur tabel
    const filteredData = res.data.map(item => ({
      segment: item.segment,
      ogp: {
        order: Number(item.ogp_order) || 0, 
        price: Number(item.ogp_price) || "-", },
      mtd: {
        tgt: Number(item.mtd_tgt) || 0, 
        billcomp_order: Number (item.mtd_billcomp_order )|| "0",
        billcomp_price: Number (item.mtd_billcomp_price )|| "0",
        ach: item.mtd_ach || "-",
      },
      gmom: item.gmom || "-",
      ytd: {
        tgt: Number(item.ytd_tgt) || 0, 
        billcomp_order: Number (item.ytd_billcomp_order )|| "0",
        billcomp_price: Number (item.ytd_billcomp_price )|| "0",
        ach: item.ytd_ach || "-",
      },
      gytd: item.gytd || "-"
    }));

    setData(filteredData); // Set data yang sudah difilter
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
    setIsPeriodSelected(false);
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

  return (
    <div className="flex h-screen">
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 ${menuOpen ? "translate-x-0" : "-translate-x-full"} w-64`}
      >
        <Sidebar menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      </div>

      <div className={`transition-all duration-300 ${menuOpen ? "ml-80 w-[calc(100%-320px)]" : "ml-0 w-full"} flex-1 flex flex-col`}>
        <Navbar toggleMenu={() => setMenuOpen(!menuOpen)} />
        <div className="p-12 mt-20 bg-slate-50 shadow-lg rounded-lg relative w-[95%] mx-auto min-h-[83vh]">
          <h1 className="text-2xl font-bold text-center mb-2">Trends Revenue Performance RLEGS - Per Witel</h1>
          <div className="w-full border-t-2 border-gray-300 mb-8"></div>

          <div className="absolute top-[155px] left-13 flex items-center space-x-3">
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
            <button onClick={handleSearch} className="bg-black text-white p-2 rounded-lg flex items-center space-x-8 mt-6">
              <FaSearch />
              <span>Search</span>
            </button>
          </div>


          {loading && (
            <div className="w-full mt-5 bg-gray-300 rounded-full h-4 relative">
              <div className="bg-blue-500 h-4 rounded-full text-white text-xs flex items-center justify-center" style={{ width: `${progress}%` }}>
                {progress}%
              </div>
            </div>
          )}

          <div className="overflow-x-auto mt-40">
            <h2 className="text-xl font-bold text-center bg-black text-white p-3 rounded min-w-[1150px]">Report Revenue Tanjung Selor</h2>
            <table className="min-w-full border-2 border-white text-center">
              <thead>
              <tr className="bg-blue-500 text-white">
                  <th rowSpan="2" className="border-4 px-4 py-2">SEGMENT</th>
                  <th colSpan="2" className="border-4 px-4 py-2">OGP NGTMA</th>
                  <th colSpan="4" className="border-4 px-4 py-2">MTD FEBRUARY 2025</th>
                  <th rowSpan="2" className="border-4 px-4 py-2">GMOM</th>
                  <th colSpan="4" className="border-4 px-4 py-2">YTD FEBRUARY 2025</th>
                  <th rowSpan="2" className="border-4 px-4 py-2">GYTD</th>
                </tr>
                <tr className="bg-blue-500 text-white">
                  <th className="border-4 px-4 py-2">Order</th>
                  <th className="border-4 px-4 py-2">Price</th>
                  <th className="border-4 px-4 py-2">TGT</th>
                  <th className="border-4 px-4 py-2">BILLCOMP Order</th>
                  <th className="border-4 px-4 py-2">BILLCOMP Price</th>
                  <th className="border-4 px-4 py-2">ACH</th>
                  <th className="border-4 px-4 py-2">TGT</th>
                  <th className="border-4 px-4 py-2">BILLCOMP Order</th>
                  <th className="border-4 px-4 py-2">BILLCOMP Price</th>
                  <th className="border-4 px-4 py-2">ACH</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                    <tr key={index} className="border-2, bg-blue-100">
                    <td className="border-4 px-4 py-2 font-bold">{row.segment}</td>
                    <td className="border-4 px-4 py-2">{row.ogp.order}</td>
                    <td className="border-4 px-4 py-2">{row.ogp.price}</td>
                    <td className="border-4 px-4 py-2">{row.mtd.tgt}</td>
                    <td className="border-4 px-4 py-2">{row.mtd.billcomp_order}</td>
                    <td className="border-4 px-4 py-2">{row.mtd.billcomp_price}</td>
                    <td className="border-4 px-4 py-2">{row.mtd.ach}</td>
                    <td className="border-4 px-4 py-2">{row.gmom}</td>
                    <td className="border-4 px-4 py-2">{row.ytd.tgt}</td>
                    <td className="border-4 px-4 py-2">{row.ytd.billcomp_order}</td>
                    <td className="border-4 px-4 py-2">{row.ytd.billcomp_price}</td>
                    <td className="border-4 px-4 py-2">{row.ytd.ach}</td>
                    <td className="border-4 px-4 py-2">{row.gytd}</td>
                  </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="relative w-full mt-18">
            <div className="w-[100%] mx-auto border-t-[2px] border-gray-400 opacity-50 mb-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGTMAReport;














