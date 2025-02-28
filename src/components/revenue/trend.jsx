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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const sidebarRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState([
    { segment: "DGS", percentage: "", target: "", revenue: "" },
    { segment: "PDS", percentage: "", target: "", revenue: "" },
    { segment: "DSS", percentage: "", target: "", revenue: "" },
  ]);

  const handleChange = (e, index, field) => {
    const updatedData = [...data];
    updatedData[index][field] = e.target.value;
    setData(updatedData);
  };

  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const segments = ["DGS", "DPS", "DSS"];
  const years = [""];

  // GET: Mengambil data
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/revenue-trend");
      const filteredData = res.data.map(item => ({
        segment: item.segment,
        percentage: item.percentage,
        tgt: item.tgt,
        rev: item.rev,
        month: item.month,
        year: item.year
      }));
      console.log("Filtered data:", filteredData);
      setData(filteredData); // Set data yang sudah difilter
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
          tgt: item.target, // Ubah `target` menjadi `tgt`
          rev: item.revenue // Ubah `revenue` menjadi `rev`
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
      setShowPopup(false);
      
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleUpdateData = async (monthYear) => {
    try {
      const [month, year] = monthYear.split(" ");
  
      // Cek apakah data sudah ada berdasarkan bulan & tahun
      const existingData = data.find(item => item.month === month && item.year === year);
  
      if (!existingData) {
        alert(`Tidak ada data yang bisa diupdate untuk ${monthYear}.`);
        return;
      }
  
      // Set popup untuk edit data
      setPopupData({
        month: existingData.month,
        year: existingData.year,
        data: existingData.data // Menampilkan data yang ada di popup
      });
  
      setShowPopup(true); // Tampilkan popup untuk edit
  
      // Jika user menekan tombol simpan di popup, update data ke backend
      const updatedData = {
        month: existingData.month,
        year: existingData.year,
        data: existingData.data.map(item => ({
          percentage: item.percentage,
          tgt: item.target, // Ubah `target` menjadi `tgt`
          rev: item.revenue // Ubah `revenue` menjadi `rev`
        }))
      };
  
      // Kirim update ke backend
      await axios.put("http://localhost:5000/api/revenue-trend", updatedData);
  
      // Perbarui data di state
      setData(prevData =>
        prevData.map(item =>
          item.month === month && item.year === year
            ? { ...item, data: updatedData.data }
            : item
        )
      );
  
      setShowPopup(false); // Tutup popup setelah update
  
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  


  const [popupData, setPopupData] = useState({
    month: selectedMonth, 
    year: selectedYear,
    data: [
      { segment: "DGS", percentage: "", target: "", revenue: "" },
      { segment: "DPS", percentage: "", target: "", revenue: "" },
      { segment: "DSS", percentage: "", target: "", revenue: "" }
    ]
  });
  
  
  const handlePopupDataChange = (e, index, field) => {
    const updatedData = [...popupData.data]; // Meng-copy data yang ada
    updatedData[index][field] = e.target.value; // Mengupdate field yang sesuai
    setPopupData({
      ...popupData,
      data: updatedData // Meng-update state popupData
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

      <div className={`transition-all duration-300 ${menuOpen ? "ml-80 w-[calc(100%-320px)]" : "ml-0 w-full"} flex-1 flex flex-col`}>
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
                    <button onClick={() => setSelectedYear((prev) => prev - 1)} className="text-lg">◀</button>
                    <span className="font-bold">{selectedYear}</span>
                    <button onClick={() => setSelectedYear((prev) => prev + 1)} className="text-lg">▶</button>
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
            <button onClick={() => setShowPopup(true)} className="bg-gray-200 p-2 border-2 flex items-center space-x-2 mt-6 rounded hover:bg-gray-300">
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
                <table className="min-w-full border-2 border-white text-center">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th rowSpan="2" className="border-4 px-4 py-2">SEGMENT</th>
                            {columns.map((column) => (
                              <th key={column} colSpan="3" className="border-4 px-4 py-2 relative">
                                  {column} 
                                  <button 
                                    onClick={async () => {
                                      await handleUpdateData(monthYear);
                                      const monthYear = `${popupData.month} ${popupData.year}`;
                                      setShowPopup(false);       // Tutup popup setelah update
                                    }} 
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


            {showPopup && editData && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                  <h2 className="text-xl font-bold mb-4">Edit Data Bulan {editData.month}</h2>
                  
                  {/* Pilih Bulan (Non-editable) */}
                  <label className="block font-bold">Bulan</label>
                  <input type="text" value={editData.month} readOnly className="w-full p-2 border rounded bg-gray-100 mb-2" />

                  {/* Pilih Tahun */}
                  <label className="block font-bold">Tahun</label>
                  <select value={editData.year} onChange={(e) => setEditData({ ...editData, year: e.target.value })} className="w-full p-2 border rounded mb-4">
                    {[2024, 2025, 2026].map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                  {/* Input Data */}
                  {editData.data.map((item, index) => (
                    <div key={index} className="mb-4">
                      <label className="block font-bold">{item.segment}</label>
                      <input type="number" placeholder="Percentage" value={item.percentage} 
                        onChange={(e) => handleEditDataChange(e, index, "percentage")} className="w-full p-2 border rounded mb-2" />
                      <input type="number" placeholder="Target" value={item.target} 
                        onChange={(e) => handleEditDataChange(e, index, "target")} className="w-full p-2 border rounded mb-2" />
                      <input type="number" placeholder="Revenue" value={item.revenue} 
                        onChange={(e) => handleEditDataChange(e, index, "revenue")} className="w-full p-2 border rounded" />
                    </div>
                  ))}

                  {/* Tombol Submit & Close */}
                  <div className="flex justify-end space-x-4 mt-4">
                    <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Close</button>
                    <button onClick={handleSubmitEdit} className="px-4 py-2 bg-blue-500 text-white rounded">Save Changes</button>
                  </div>
                </div>
              </div>
            )}


            {/* Pop-up for adding data */}
            {showPopup && (
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
                              onChange={(e) => handlePopupDataChange(e, index, "segment")}
                              className="w-full"
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              type="text"
                              value={item.percentage}
                              onChange={(e) => handlePopupDataChange(e, index, "percentage")}
                              className="w-full"
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              type="text"
                              value={item.target}
                              onChange={(e) => handlePopupDataChange(e, index, "target")}
                              className="w-full"
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              type="text"
                              value={item.revenue}
                              onChange={(e) => handlePopupDataChange(e, index, "revenue")}
                              className="w-full"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Submit Button */}
                    <button 
                      onClick={async () => {
                        await handleSubmit();  // Submit the form data
                        setShowPopup(false);   // Close the popup after saving
                      }} 
                      className="bg-blue-500 text-white p-2 rounded-lg mt-4"
                    >
                      Save Data
                    </button>
                  <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => setShowPopup(false)}
                    >
                    Close
                  </button>
              </div>
          </div>
        )}
    </div>
  );
};

export default TREND;