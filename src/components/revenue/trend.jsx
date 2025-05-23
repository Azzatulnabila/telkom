import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import { FaCalendarAlt, FaUpload } from "react-icons/fa";
import { FaCheckCircle } from 'react-icons/fa';
import axios from "axios";

const TREND = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  const [showCalendar, setShowCalendar] = useState(false);
  const [columns, setColumns] = useState([]);
  const calendarRef = useRef(null);
  const buttonRef = useRef(null);
  const sidebarRef = useRef(true);
  const inputRefs = useRef([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [updatedData, setUpdatedData] = useState(null);
  const [isInput, setIsInput] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [data, setData] = useState([
    { segment: "DGS", percentage: "", tgt: "", rev: "" },
    { segment: "DPS", percentage: "", tgt: "", rev: "" },
    { segment: "DSS", percentage: "", tgt: "", rev: "" },
  ]);
  

  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/revenue-trend");
      
      console.log("Full API Response:", res.data);
  
      const filteredData = res.data.filter(item => 
        String(item.month).toLowerCase() === String(selectedMonth).toLowerCase() &&
        String(item.year) === String(selectedYear)
      );
  
      console.log("Filtered Data:", filteredData); 
      setData(filteredData.length > 0 
        ? [...filteredData].sort((a, b) => a.segment.localeCompare(b.segment))
        : [
        { segment: "DGS", percentage: "", tgt: "", rev: "" },
        { segment: "DPS", percentage: "", tgt: "", rev: "" },
        { segment: "DSS", percentage: "", tgt: "", rev: "" }
      ]);
      setColumns([`${selectedMonth} ${selectedYear}`]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
  setShowCalendar(false); 
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
          segment: item.segment,
          percentage: item.percentage
            ? item.percentage.replace('%', '') + '%'
            : '',
          tgt: item.tgt, 
          rev: item.rev 
        }))
      };
      await axios.post("http://localhost:5000/api/revenue-trend", dataToSubmit);
      const fullMonthYear = `${popupData.month} ${popupData.year}`;
      if (!columns.includes(fullMonthYear)) {
        setColumns((prevColumns) => [...prevColumns, fullMonthYear]);
      }
      await fetchData();
      setShowAddPopup(true);
      setIsInput(true); 
      setTimeout(() => setIsInput(false), 2000); 
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleEditClick = (month, year, data) => {
    setPopupData({
      month: month,
      year: year,
      data: [...data].sort((a, b) => a.segment.localeCompare(b.segment)).map(item => ({
        segment: item.segment,
        percentage: item.percentage || "",
        tgt: item.tgt || "", 
        rev: item.rev || ""
      }))
    });
    setShowEditPopup(true);
  };
  
  const handleUpdateData = (e, index, field) => {
    if (!popupData || !popupData.data || !popupData.data[index]) {
      console.error("Data tidak ditemukan pada indeks:", index);
      return;
    }
    let value = e.target.value;
    const updatedData = [...popupData.data];
    updatedData[index][field] = value; 
    setPopupData({ ...popupData, data: updatedData });
  };

  
  const handleSaveEdit = async () => {
    try {
      await axios.put("http://localhost:5000/api/revenue-trend", {
        month: popupData.month,
        year: popupData.year,
        data: popupData.data.map(item => ({
          segment: item.segment,
          percentage: item.percentage
            ? item.percentage.replace('%', '') + '%'
            : '',
          tgt: item.tgt,
          rev: item.rev
        }))
      });

      await fetchData();
  
      setData(prevData =>
        prevData.map(item =>
          item.month === popupData.month && item.year === popupData.year
            ? { ...item, data: popupData.data } 
            : item
        )
      );
  
      setIsUpdated(true);
      setUpdatedData(popupData); 
      setTimeout(() => setIsUpdated(false), 2000);  
      setShowEditPopup(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };  
  
  const handleAddClick = () => {
    setPopupData({
      month: selectedMonth,
      year: selectedYear,
      data: [
        { segment: "DGS", percentage: "", tgt: "", rev: "" },
        { segment: "DPS", percentage: "", tgt: "", rev: "" },
        { segment: "DSS", percentage: "", tgt: "", rev: "" }
      ]
    });
    setShowAddPopup(true);
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
  

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);  

  return (
    <div className="flex h-screen">
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 ${menuOpen ? "translate-x-0" : "-translate-x-full"} w-64`}
        
      >
        <Sidebar menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      </div>

      <div className={`transition-all duration-300 flex-1 flex flex-col`}>

        {/* Navbar */}
        <Navbar
          toggleMenu={() => setMenuOpen(!menuOpen)}
          menuOpen={menuOpen}
        />
        <div className={`transition-all duration-300 ${menuOpen ? "md:ml-64" : "md:ml-0"} px-3 sm:px-1`}>
        <div className="p-6 sm:p-12 mt-24 bg-slate-50 shadow-lg rounded-lg relative w-[95%] mx-auto min-h-[83vh]">
          <h1 className="text-2xl font-bold text-center mb-2">Trends Revenue Performance RLEGS - Per Witel</h1>
          <div className=" border-t-2 border-gray-300 mb-8"></div>

          <div className="absolute top-[150px] flex items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
                    <button onClick={() => setSelectedYear((prev) => String(Number(prev) - 1))} className="text-lg">▶</button>
                    <span className="font-bold">{selectedYear}</span>
                    <button onClick={() => setSelectedYear((prev) => String(Number(prev) + 1))} className="text-lg">▶</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((month) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(month)}
                        className={`p-2 rounded-lg transition-all duration-200 ${selectedMonth === month ? "bg-blue-500 text-white border-2" : "bg-gray-100"} hover:bg-gray-300`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-start">
              <span className="font-bold text-sm mb-1 opacity-0">.</span>
              <button
                onClick={() => handleAddClick(true)}
                className="bg-gray-200 p-2 sm:p-3 border-2 flex items-center space-x-1 sm:space-x-2 rounded hover:bg-gray-300 w-auto"
              >
                <FaUpload />
                <span>Input Data</span>
              </button>
            </div>
          </div>

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

          {/* Table */}
            <div className="overflow-x-auto mt-40">
                <h2 className="text-xl font-bold text-center bg-black text-white p-3 rounded">Report Revenue Tanjung Selor</h2>
                <table className="min-w-full table-fixed border-2 border-white text-center">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th rowSpan="2" className="border-4 px-4 py-2">SEGMENT</th>
                            {columns.map((column) => (
                              <th key={column} colSpan="3" className="border-4 px-4 py-2 relative">
                                  {column} 
                                  <button onClick={(e) => handleEditClick(selectedMonth, selectedYear, data)} 
                                    className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded hover:bg-gray-300"
                                  >
                                    Update Data
                                  </button>
                              </th>
                          ))}
                        </tr>
                        <tr className="bg-blue-500 text-white">
                            {columns.map((column, index) => (
                                <React.Fragment key={index}>
                                    <th className="border-4 px-4 py-2">Percentage</th>
                                    <th className="border-4 px-4 py-2">Target</th>
                                    <th className="border-4 px-4 py-2">Revenue</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                    {data
                    .filter((item) => {
                      const itemMonthYear = `${item.month} ${item.year}`;
                      const fullMonthYear = `${selectedMonth} ${selectedYear}`;
                      return itemMonthYear === fullMonthYear; 
                    })
                    .map((item, index) => (
                      <tr key={index} className="bg-gray-100">
                        <td className="border-4 px-4 py-2">{item.segment}</td>
                        {columns.map((column) => (
                          <React.Fragment key={column}>
                            <td className="border-4 px-4 py-2">{item.percentage || ""}</td>
                            <td className="border-4 px-4 py-2">{item.tgt || ""}</td>
                            <td className="border-4 px-4 py-2">{item.rev || ""}</td>
                          </React.Fragment>
                        ))}
                    </tr>
                    ))}
                  </tbody>
                 </table>
                </div>
              </div>
            </div>


            {showEditPopup && (
              <div className={`fixed top-0 ${menuOpen ? "left-64 w-[calc(100%-16rem)]" : "left-0 w-full"} h-full bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300`}>
                <div className="bg-white p-8 rounded-lg w-100 mt-10">
                  <h2 className="text-xl font-bold mb-4">
                    Edit Data - {popupData.month} {popupData.year}
                  </h2>

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
                                onChange={(e) => handleUpdateData(e, rowIndex, field)}
                                className="w-full"
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Submit Button */}
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={async () => {
                        await handleSaveEdit(); 
                        setShowEditPopup(false); 
                      }}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      Save Data
                    </button>
                    <button
                      className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
                      onClick={() => setShowEditPopup(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* Pop-up for adding data */}
            {showAddPopup && (
              <div className={`fixed top-0 ${menuOpen ? "left-64 w-[calc(100%-16rem)]" : "left-0 w-full"} h-full bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300`}>
                <div className="bg-white p-8 rounded-lg w-100 mt-10">
                  <h2 className="text-xl font-bold mb-4">Tambah Data</h2>

                  {/* Input for month and year */}
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

                  {/* Table for the data input */}
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
                                value={
                                  field === "percentage"
                                    ? (popupData.data[rowIndex][field] || "")
                                    : item[field]
                                }
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
                                  handleUpdateData({ target: { value: val } }, rowIndex, field);
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

                  {/* Submit Button */}
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
      </div>
    </div>
  );
};

export default TREND;