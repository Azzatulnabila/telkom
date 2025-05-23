import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import { FaUpload, FaSearch, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const SEGMENT = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  const [showCalendar, setShowCalendar] = useState(false);
  const [columns, setColumns] = useState([]);
  const calendarRef = useRef(null);
  const inputRefs = useRef([]);
  const inputRefs2 = useRef([]);
  const buttonRef = useRef(null);
  const sidebarRef = useRef(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [updatedData, setUpdatedData] = useState(null);
  const [isInput, setIsInput] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showAddPopup2, setShowAddPopup2] = useState(false);

    const [showEditPopup, setShowEditPopup] = useState(false);
    const [data, setData] = useState([
      { segment: "DGS", percentage: "", tgt: "", rev: "" },
      { segment: "DPS", percentage: "", tgt: "", rev: "" },
      { segment: "DSS", percentage: "", tgt: "", rev: "" },
    ]);
    
  
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const [table1, setTable1] = useState([])
  const [table2, setTable2] = useState([]); 

  const fetchData = async () => {
    try {
      const [res1, res2] = await Promise.all([
        axios.get("http://localhost:5000/api/revenue-segment/segmen1"),
        axios.get("http://localhost:5000/api/revenue-segment/segmen2")
      ]);
  
      console.log("Data Table 1 (Revenue Trend):", res1.data);
      console.log("Data Table 2 (Revenue Segment):", res2.data);
      const filteredTable1 = res1.data.filter(item =>
        String(item.month).toLowerCase() === String(selectedMonth).toLowerCase() &&
        String(item.year) === String(selectedYear)
      );
  
      console.log("Filtered Data Table 1:", filteredTable1);
  
      setTable1(filteredTable1.length > 0 ? filteredTable1 : [
        { segment: "DGS", percentage: "", tgt: "", rev: "" },
        { segment: "PDS", percentage: "", tgt: "", rev: "" },
        { segment: "DSS", percentage: "", tgt: "", rev: "" }
      ]);
  
      if (filteredTable1.length > 0) {
            setTable1(filteredTable1);
        } else {
            setTable1([{ message: "Tidak ada data yang tersedia" }]);
        }
      setColumns([`${selectedMonth} ${selectedYear}`]);
      
  
      const filteredTable2 = res2.data.map(item => ({
        segment: item.segment,
        mtd_tgt: Number(item.mtd_tgt) || 0,
        mtd_real: Number(item.mtd_real) || 0,
        mtd_ach: item.mtd_ach ? `${item.mtd_ach}` : "-", 
        gmom: item.gmom ? `${parseFloat(item.gmom)}` : "-", 
        ytd_tgt: Number(item.ytd_tgt) || 0,
        ytd_real: Number(item.ytd_real) || 0,
        ytd_ach: item.ytd_ach ? `${item.ytd_ach}` : "-", 
        gyoy: item.gyoy ? `${parseFloat(item.gyoy)}` : "-" 
      }));
      setTable2(filteredTable2);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  
  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);
  

  useEffect(() => {
    const savedMonth = localStorage.getItem("selectedMonth");
    const savedYear = localStorage.getItem("selectedYear");
    if (savedMonth) setSelectedMonth(savedMonth);
    if (savedYear) setSelectedYear(Number(savedYear)); 
    fetchData();
  }, []);

  const handleMonthSelect = (month) => {
  setSelectedMonth(month);
  localStorage.setItem("selectedMonth", month); 
  setColumns([`${month} ${selectedYear}`]); 
 };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    localStorage.setItem("selectedYear", year); 
    setColumns([`${selectedMonth} ${year}`]); 
  };
    

  const handleSubmit = async () => {
    try {
        const dataToSubmit = {
            month: popupData.month,
            year: popupData.year,
            data: popupData.data.map(item => ({
                percentage: item.percentage
                  ? item.percentage.replace('%', '') + '%'
                  : '',
                tgt: item.tgt, 
                rev: item.rev 
            }))
        };
        await axios.post("http://localhost:5000/api/revenue-segment/segmen1", dataToSubmit);
        await fetchData();
        setPopupData({
          month: selectedMonth,
          year: selectedYear,
          data: [
            { segment: "DGS", percentage: "", tgt: "", rev: "" },
            { segment: "DPS", percentage: "", tgt: "", rev: "" },
            { segment: "DSS", percentage: "", tgt: "", rev: "" }
          ]
        });
        setShowAddPopup(false);
        setIsInput(true); 
        setTimeout(() => setIsInput(false), 2000); 
      } catch (error) {
          console.error("Error submitting data:", error);
      }
  };

   const [popupData, setPopupData] = useState({
      month: selectedMonth, 
      year: selectedYear,
      data: [
        { segment: "DGS", percentage: "", tgt: "", rev: "" },
        { segment: "DPS", percentage: "", tgt: "", rev: "" },
        { segment: "DSS", percentage: "", tgt: "", rev: "" }
      ]
    });
    
    const handleAddDataChange = (e, index, field) => {
      const value = e.target.value;
  
      setPopupData((prevPopupData) => {
          const updatedData = [...prevPopupData.data];
  
          if (!updatedData[index]) {
              updatedData[index] = { segment: "", percentage: "", tgt: "", rev: "" };
          }
          if (field === "segment") {
              const [inputMonth, inputYear] = value.split(" ");
  
              const isDuplicate = updatedData.some((item, idx) => {
                  if (!item.segment) return false; 
                  const [existingMonth, existingYear] = item.segment.split(" ");
                  return (
                      idx !== index &&
                      existingMonth?.toLowerCase() === inputMonth?.toLowerCase() &&
                      existingYear === inputYear
                  );
              });
  
              if (isDuplicate) {
                  alert("GAGAL: Data untuk bulan dan tahun tersebut sudah ada. Silakan masukkan bulan dan tahun yang berbeda.");
                  return prevPopupData; 
              } else {
                  alert("BERHASIL: Data baru untuk bulan dan tahun tersebut dapat ditambahkan.");
              }
            }
    
            updatedData[index][field] = value;
    
            return { ...prevPopupData, data: updatedData };
        });
    };
    
    const handlePopupMonthChange = (e) => {
      setPopupData({
        ...popupData,
        month: e.target.value
      });
    };
    
    const handlePopupYearChange = (e) => {
      setPopupData({
        ...popupData,
        year: e.target.value
      });
    };

    const handleEditClick2 = async () => {
      try {
          const res2 = await axios.get("http://localhost:5000/api/revenue-segment/segmen2");
  
          console.log("Data Table 2 (Revenue Segment):", res2.data);
  
          setPopupData2({
              data: res2.data.map(item => ({
                  segment: item.segment,
                  mtd_tgt: Number(item.mtd_tgt) || 0,
                  mtd_real: Number(item.mtd_real) || 0,
                  mtd_ach: item.mtd_ach ? `${item.mtd_ach}` : "-",
                  gmom: item.gmom ? `${parseFloat(item.gmom)}` : "-",
                  ytd_tgt: Number(item.ytd_tgt) || 0,
                  ytd_real: Number(item.ytd_real) || 0,
                  ytd_ach: item.ytd_ach ? `${item.ytd_ach}` : "-",
                  gyoy: item.gyoy ? `${parseFloat(item.gyoy)}` : "-"
              }))
          });
  
          setShowAddPopup2(true);
      } catch (error) {
          console.error("Error fetching data for popup:", error);
      }
  };
  
    const handleSaveEdit2 = async () => {
      try {
        await axios.put("http://localhost:5000/api/revenue-segment/segmen2", {
          data: popupData2.data.map(item => ({
            segment: item.segment,
            mtd_tgt: item.mtd_tgt,
            mtd_real: item.mtd_real,
            mtd_ach: item.mtd_ach,
            gmom: item.gmom || "-",
            ytd_tgt: item.ytd_tgt || "-",
            ytd_real: item.ytd_real || "-",
            ytd_ach: item.ytd_ach || "-",
            gyoy: item.gyoy || "-"
          }))
        });
    
        setTable2(prevData =>
          prevData.map(item =>
            item.segment === popupData2.data.find(data => data.segment === item.segment)?.segment
              ? { ...item, ...popupData2.data.find(data => data.segment === item.segment) }
              : item
          )
        );
        await fetchData();
        setIsUpdated(true);
        setUpdatedData(popupData); 
        setTimeout(() => setIsUpdated(false), 2000);  
        setShowAddPopup2(true);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    };
    
    const [popupData2, setPopupData2] = useState({
      data: [
        { segment: "DGS", mtd_tgt: "", mtd_real: "", mtd_ach: "", gmom: "", ytd_tgt: "", ytd_real: "", ytd_ach: "", gyoy: "" },
        { segment: "DPS", mtd_tgt: "", mtd_real: "", mtd_ach: "", gmom: "", ytd_tgt: "", ytd_real: "", ytd_ach: "", gyoy: "" },
        { segment: "DSS", mtd_tgt: "", mtd_real: "", mtd_ach: "", gmom: "", ytd_tgt: "", ytd_real: "", ytd_ach: "", gyoy: "" }
      ]
    });
    

    const handleUpdateData2 = (e, index, field) => {
      if (!popupData2 || !popupData2.data || !popupData2.data[index]) {
          console.error("Data tidak ditemukan pada indeks:", index);
          return;
      }
  
      const updatedData = [...popupData2.data];
      updatedData[index][field] = e.target.value;
  
      setPopupData2({ ...popupData2, data: updatedData });
  };


  useEffect(() => {
      const handleClickOutside = (e) => {
        if (
          calendarRef.current &&
          !calendarRef.current.contains(e.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(e.target)
        ) {
          setShowCalendar(false);
        }
      };
    
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
  const handleKeyDown = (e, row, col) => {
      if (e.key === "ArrowRight") {
        inputRefs.current[row]?.[col + 1]?.focus();
      } else if (e.key === "ArrowLeft") {
        inputRefs.current[row]?.[col - 1]?.focus();
      } else if (e.key === "ArrowDown") {
        inputRefs.current[row + 1]?.[col]?.focus();
      } else if (e.key === "ArrowUp") {
        inputRefs.current[row - 1]?.[col]?.focus();
      }
    };


    const handleKeyDown2 = (e, rowIndex, colIndex) => {
      const totalRows = popupData2.data.length;
      const totalCols = 9; 

      let nextRow = rowIndex;
      let nextCol = colIndex;

      if (e.key === "ArrowDown") {
        nextRow = Math.min(rowIndex + 1, totalRows - 1);
      } else if (e.key === "ArrowUp") {
        nextRow = Math.max(rowIndex - 1, 0);
      } else if (e.key === "ArrowRight") {
        nextCol = Math.min(colIndex + 1, totalCols - 1);
      } else if (e.key === "ArrowLeft") {
        nextCol = Math.max(colIndex - 1, 0);
      }

      if (nextRow !== rowIndex || nextCol !== colIndex) {
        e.preventDefault();
        inputRefs2.current[nextRow][nextCol]?.focus();
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [selectedMonth, selectedYear]);  
  

  return (
    <div className="flex h-screen bg-gray-100 overflow-y-scroll no-scrollbar min-h-screen">
      {/* Sidebar */}
      <div ref={sidebarRef} className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 ${menuOpen ? "translate-x-0" : "-translate-x-full"} w-64`}>
        <Sidebar menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 flex-1 flex flex-col ${
        menuOpen ? "md:ml-64 md:w-[calc(100%-16rem)]" : "w-full"
      }`}>

        {/* Navbar */}
        <Navbar
          toggleMenu={() => setMenuOpen(!menuOpen)}
          menuOpen={menuOpen}
        />
       
       <div className="p-6 sm:p-12 mt-24 bg-slate-50 shadow-lg rounded-lg relative w-[95%] mx-auto">
          <h1 className="text-2xl font-bold text-center mb-2">Trends Revenue Performance RLEGS - Per Segment</h1>
          <div className="w-full border-t-2 border-gray-300 mb-8"></div>

          {/* Periode Picker & Upload Button */}
          <div className="absolute top-[112px] left-13 flex items-center space-x-3">
            <div className="flex flex-col items-start relative">
              <span className="font-bold text-sm mb-1">PERIODE</span>
              <div
                ref={buttonRef}
                className="flex items-center space-x-2 sm:space-x-4 cursor-pointer bg-gray-200 hover:bg-gray-300 p-2 sm:p-3 rounded border-2 w-auto"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <FaCalendarAlt className="text-gray-700" />
                <span>{selectedMonth ? `${selectedMonth} ${selectedYear}` : "Pilih Bulan"}</span>
              </div>
              {showCalendar && (
                <div 
                  ref={calendarRef}
                  className="absolute top-20 bg-white p-6 shadow-lg rounded-lg z-50 w-80"
                >
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
            <button onClick={() => setShowAddPopup(true)} className="bg-gray-200 p-2 border-2 flex items-center space-x-2 mt-6 rounded hover:bg-gray-300">
              <FaUpload />
              <span>Input Data</span>
            </button>
          </div>

          {isInput && (
            <div
              className={`fixed top-0 ${menuOpen ? "left-64 w-[calc(100%-16rem)]" : "left-0 w-full"} h-full flex items-center justify-center bg-black bg-opacity-50 z-50 transition-all duration-300`}
            >
              <div className="flex flex-col items-center justify-center text-white">
                <div className="bg-white rounded-full p-6 shadow-lg flex items-center justify-center animate-popIn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-16 h-16 animate-checkmark text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" className="stroke-animation" />
                  </svg>
                </div>
                <span className="text-3xl font-extrabold animate-fadeIn mt-4">
                  Data berhasil ditambahkan
                </span>
              </div>
            </div>
          )}

           {isUpdated && (
            <div
              className={`fixed top-0 ${menuOpen ? "left-64 w-[calc(100%-16rem)]" : "left-0 w-full"} h-full flex items-center justify-center bg-black bg-opacity-50 z-50 transition-all duration-300`}
            >
              <div className="flex flex-col items-center justify-center text-white">
                <div className="bg-white rounded-full p-6 shadow-lg flex items-center justify-center animate-popIn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-16 h-16 animate-checkmark text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" className="stroke-animation" />
                  </svg>
                </div>
                <span className="text-3xl font-extrabold animate-fadeIn mt-4">
                  Data berhasil diperbarui
                </span>
              </div>
            </div>
          )}

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

          {showAddPopup && (
              <div className={`fixed top-0 ${menuOpen ? "left-64 w-[calc(100%-16rem)]" : "left-0 w-full"} h-full bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300`}>
                <div className="bg-white p-8 rounded-lg w-100 mt-10">
                  <h2 className="text-xl font-bold mb-4">Tambah Data</h2>

                  <div className="mb-4">
                    <label htmlFor="month" className="block mb-2">Pilih Bulan</label>
                    <select
                      id="month"
                      value={popupData.month}
                      onChange={handlePopupMonthChange}
                      className="border p-2 w-full mb-4"
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="year" className="block mb-2">Pilih Tahun</label>
                    <input
                      id="year"
                      type="text"
                      value={popupData.year}
                      onChange={handlePopupYearChange}
                      className="border p-2 w-full"
                      placeholder="Masukkan Tahun"
                    />
                  </div>

                  <table className="w-full table-auto mt-4">
                    <thead>
                      <tr>
                        <th className="border p-2">Segment</th>
                        <th className="border p-2">Percentage</th>
                        <th className="border p-2">Target</th>
                        <th className="border p-2">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {popupData.data.map((item, rowIndex) => (
                      <tr key={rowIndex}>
                        {["segment", "percentage", "tgt", "rev"].map((field, colIndex) => (
                          <td className="border p-2" key={field}>
                            {field === "segment" ? (
                              <span>{item[field]}</span>
                            ) : (
                              <input
                                type="text"
                                value={item[field]}
                                ref={(el) => {
                                  if (!inputRefs.current[rowIndex]) {
                                    inputRefs.current[rowIndex] = [];
                                  }
                                  inputRefs.current[rowIndex][colIndex] = el;
                                }}
                                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                 onChange={(e) => {
                                  let val = e.target.value;
                                  val = val.replace(/[^0-9]/g, "");
                                  if (field === "percentage" && val !== "") {
                                    val = val + "%";
                                  }
                                  handleAddDataChange({ target: { value: val } }, rowIndex, field);
                                }}
                                className="w-full"
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex space-x-4 mt-4">
                    <button 
                      onClick={async () => {
                        await handleSubmit();  
                        setShowAddPopup(false);   
                      }} 
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      Save Data
                    </button>
                  <button
                      className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
                      onClick={() => setShowAddPopup(false)}
                    >
                    Close
                  </button>
                  </div>
              </div>
              </div>
              )}


          {/* Jarak antar tabel */}
          <button onClick={() => handleEditClick2(data)} className="bg-gray-200 p-2 border-2 flex items-center space-x-2 mt-6 rounded hover:bg-gray-300">
              <FaUpload />
              <span>Update Data</span>
            </button>
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


            {showAddPopup2 && (
            <div className={`fixed top-0 ${menuOpen ? "left-64 w-[calc(100%-16rem)]" : "left-0 w-full"} h-full bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300`}>
              <div className="bg-white p-8 rounded-lg w-full max-w-5xl mt-10">
                <h2 className="text-xl font-bold mb-4">Tambah Data Segment</h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-2 border-white text-center">
                    <thead>
                      {/* Header Table tetap */}
                    </thead>
                    <tbody>
                      {popupData2.data.map((item, rowIndex) => (
                        <tr key={rowIndex} className="border-2">
                          {["segment", "mtd_tgt", "mtd_real", "mtd_ach", "gmom", "ytd_tgt", "ytd_real", "ytd_ach", "gyoy"].map((field, colIndex) => (
                            <td className="border-2 px-4 py-2" key={field}>
                              <input
                                type="text"
                                value={item[field]}
                                ref={(el) => {
                                  if (!inputRefs2.current[rowIndex]) {
                                    inputRefs2.current[rowIndex] = [];
                                  }
                                  inputRefs2.current[rowIndex][colIndex] = el;
                                }}
                                onKeyDown={(e) => handleKeyDown2(e, rowIndex, colIndex)}
                                onChange={(e) => handleUpdateData2(e, rowIndex, field)}
                                className="w-full border p-1"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={async () => {
                      await handleSaveEdit2();
                      setShowAddPopup2(false);
                    }}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    Save Data
                  </button>
                  <button
                    className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
                    onClick={() => setShowAddPopup2(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SEGMENT;
