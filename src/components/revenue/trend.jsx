import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import { FaCalendarAlt, FaSearch, FaPlus } from "react-icons/fa";
import axios from "axios";

const TREND = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  const [showCalendar, setShowCalendar] = useState(false);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const sidebarRef = useRef(true);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [data, setData] = useState([
    { segment: "DGS", percentage: "", tgt: "", rev: "" },
    { segment: "PDS", percentage: "", tgt: "", rev: "" },
    { segment: "DSS", percentage: "", tgt: "", rev: "" },
  ]);
  

  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];


  // GET: Mengambil data
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/revenue-trend");
      
      console.log("Full API Response:", res.data); // Debugging
  
      const filteredData = res.data.filter(item => 
        String(item.month).toLowerCase() === String(selectedMonth).toLowerCase() &&
        String(item.year) === String(selectedYear)
      );
  
      console.log("Filtered Data:", filteredData); // Debugging
  
      setData(filteredData.length > 0 ? filteredData : [
        { segment: "DGS", percentage: "", tgt: "", rev: "" },
        { segment: "PDS", percentage: "", tgt: "", rev: "" },
        { segment: "DSS", percentage: "", tgt: "", rev: "" }
      ]);
  
      setColumns([`${selectedMonth} ${selectedYear}`]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  


  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    const fullMonthYear = `${month} ${selectedYear}`;
    if (!columns.includes(fullMonthYear)) {
      setColumns((prevColumns) => [...prevColumns, fullMonthYear]);
    }
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    const fullMonthYear = `${selectedMonth} ${year}`;
    if (!columns.includes(fullMonthYear)) {
      setColumns((prevColumns) => [...prevColumns, fullMonthYear]);
    }
  };

  const handleSubmit = async () => {
    try {
      // Prepare data to be sent to the backend
      const dataToSubmit = {
        month: popupData.month,
        year: popupData.year,
        data: popupData.data.map(item => ({
          percentage: item.percentage,
          tgt: item.tgt, 
          rev: item.rev 
        }))
      };
      
      // Send data to backend
      await axios.post("http://localhost:5000/api/revenue-trend", dataToSubmit);

      // Update columns dengan bulan dan tahun terbaru
      const fullMonthYear = `${popupData.month} ${popupData.year}`;
      if (!columns.includes(fullMonthYear)) {
        setColumns((prevColumns) => [...prevColumns, fullMonthYear]);
      }

      // ✅ Tambahkan data baru ke state `data`
      setData((prevData) => [...prevData, ...dataToSubmit.data]);
      setShowAddPopup(true);
      
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };


  const handleEditClick = (month, year, data) => {
    setPopupData({
      month: month,
      year: year,
      data: data.map(item => ({
        segment: item.segment,
        percentage: item.percentage || "",
        tgt: item.tgt || "", 
        rev: item.rev || ""
      }))
    });
    setShowEditPopup(true);
  };
  
  

  const handleUpdateData = (e, index, field) => {
    // Pastikan data ada sebelum mencoba mengubahnya
    if (!popupData || !popupData.data || !popupData.data[index]) {
      console.error("Data tidak ditemukan pada indeks:", index);
      return;
    }
  
    // Membuat salinan data dan mengubah field yang sesuai
    const updatedData = [...popupData.data];
    updatedData[index][field] = e.target.value;
  
    // Memperbarui state popupData dengan data yang sudah diubah
    setPopupData({ ...popupData, data: updatedData });
  };

  
  const handleSaveEdit = async () => {
    try {
      await axios.put("http://localhost:5000/api/revenue-trend", {
        month: popupData.month,
        year: popupData.year,
        data: popupData.data.map(item => ({
          segment: item.segment,
          percentage: item.percentage,
          tgt: item.tgt,
          rev: item.rev
        }))
      });
  
      // Update state lokal agar tampilan berubah
      setData(prevData =>
        prevData.map(item =>
          item.month === popupData.month && item.year === popupData.year
            ? { ...item, data: popupData.data }
            : item
        )
      );
  
      alert("Data berhasil diperbarui!");
      setShowEditPopup(false);
    } catch (error) {
      console.error("Error updating data:", error);
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

        // Pastikan data di index ini ada
        if (!updatedData[index]) {
            updatedData[index] = { segment: "", percentage: "", tgt: "", rev: "" };
        }

        // Cek duplikasi jika field adalah "segment"
        if (field === "segment") {
            const [inputMonth, inputYear] = value.split(" ");

            const isDuplicate = updatedData.some((item, idx) => {
                if (!item.segment) return false;  // Hindari error jika segment kosong
                const [existingMonth, existingYear] = item.segment.split(" ");
                return (
                    idx !== index &&
                    existingMonth?.toLowerCase() === inputMonth?.toLowerCase() &&
                    existingYear === inputYear
                );
            });

            if (isDuplicate) {
                alert("GAGAL: Data untuk bulan dan tahun tersebut sudah ada. Silakan masukkan bulan dan tahun yang berbeda.");
                return prevPopupData; // Jangan update state jika duplikat
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
        setLoading(false);
      }
    }, 200);
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);  // Fetch data setiap bulan dipilih  

  return (
    <div className="flex h-screen">
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 ${menuOpen ? "translate-x-0" : "-translate-x-full"} w-64`}
        
      >
        <Sidebar menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      </div>

      <div className={`transition-all duration-300 ${menuOpen ? "ml-0" : "ml-0"} flex-1 flex flex-col ${menuOpen ? "sm:ml-0 md:ml-64" : ""}`}>

        <Navbar toggleMenu={() => setMenuOpen(!menuOpen)} />
        <div className="p-12 mt-20 bg-slate-50 shadow-lg rounded-lg relative w-[95%] mx-auto min-h-[83vh]">
          <h1 className="text-2xl font-bold text-center mb-2">Trends Revenue Performance RLEGS - Per Witel</h1>
          <div className="w-full border-t-2 border-gray-300 mb-8"></div>

          <div className="absolute top-[155px] left-13 flex items-center space-x-3">
            <div className="flex flex-col items-start relative">
              <span className="font-bold text-sm mb-1">PERIODE</span>
              <div
                className="flex items-center space-x-10 cursor-pointer bg-gray-200 hover:bg-gray-300 p-2 rounded border-2"
                onClick={() => setShowCalendar(!showCalendar)}
                
              >
                <FaCalendarAlt className="text-gray-700" />
                <span>{selectedMonth ? `${selectedMonth} ${selectedYear}` : "Pilih Bulan"}</span>
              </div>
              {showCalendar && (
                <div className="absolute top-20 bg-white p-6 shadow-lg rounded-lg z-50 w-80">
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
            <button onClick={handleSearch} className="bg-black text-white hover:bg-slate-600 p-2 rounded flex items-center space-x-8 mt-6">
              <FaSearch />
              <span>Search</span>
            </button>
            <button onClick={() => setShowAddPopup(true)} className="bg-gray-200 p-2 border-2 flex items-center space-x-2 mt-6 rounded hover:bg-gray-300">
              <FaPlus />
              <span>Input Data</span>
            </button>
          </div>

          {loading && (
            <div className="w-full mt-5 bg-gray-300 rounded-full h-4 relative">
              <div className="bg-blue-500 h-4 rounded-full text-white text-xs flex items-center justify-center" style={{ width: `${progress}%` }}>
                {progress}%
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
                      // Combine month and year from the fetched data
                      const itemMonthYear = `${item.month} ${item.year}`;
                      const fullMonthYear = `${selectedMonth} ${selectedYear}`;
                      return itemMonthYear === fullMonthYear; // Filter based on both month and year
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
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg w-100 mt-10">
      {/* Menampilkan bulan dan tahun yang sedang diedit */}
      <h2 className="text-xl font-bold mb-4">
        Edit Data - {popupData.month} {popupData.year}
      </h2>

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
          {popupData.data.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">
                <input
                  type="text"
                  value={item.segment}
                  onChange={(e) => handleUpdateData(e, index, "segment")}
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={item.percentage}
                  onChange={(e) => handleUpdateData(e, index, "percentage")}
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={item.tgt}
                  onChange={(e) => handleUpdateData(e, index, "tgt")}
                  className="w-full"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={item.rev}
                  onChange={(e) => handleUpdateData(e, index, "rev")}
                  className="w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Submit Button */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={async () => {
            await handleSaveEdit(); // Submit the form data
            setShowEditPopup(false); // Close the popup after saving
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
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
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
                      {popupData.data.map((item, index) => (
                        <tr key={index}>
                          <td className="border p-2">
                            <input
                              type="text"
                              value={item.segment}
                              onChange={(e) => handleAddDataChange(e, index, "segment")}
                              className="w-full"
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              type="text"
                              value={item.percentage}
                              onChange={(e) => handleAddDataChange(e, index, "percentage")}
                              className="w-full"
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              type="text"
                              value={item.tgt}
                              onChange={(e) => handleAddDataChange(e, index, "tgt")}
                              className="w-full"
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              type="text"
                              value={item.rev}
                              onChange={(e) => handleAddDataChange(e, index, "rev")}
                              className="w-full"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Submit Button */}
                  <div className="flex space-x-4 mt-4">
                    <button 
                      onClick={async () => {
                        await handleSubmit();  // Submit the form data
                        setShowAddPopup(false);   // Close the popup after saving
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
  );
};

export default TREND;