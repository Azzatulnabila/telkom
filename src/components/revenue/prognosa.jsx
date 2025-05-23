import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { FaUpload } from "react-icons/fa";
import axios from "axios";

const PROGNOSA = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const sidebarRef = useRef(null);
  const inputRefs = useRef([]);
  const [isUpdated1, setIsUpdated1] = useState(false);
  const [isUpdated2, setIsUpdated2] = useState(false);
  const [showAddPopup1, setShowAddPopup1] = useState(false);
  const [showAddPopup2, setShowAddPopup2] = useState(false);
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
        needScaling: item?.needScaling || "-",
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


    const handleEditClick1 = async () => {
      try {
        const res1 = await axios.get("http://localhost:5000/api/revenue-prognosa/prognosaMtd");
    
        if (!Array.isArray(res1.data)) {
          throw new Error("Data yang diterima bukan array.");
        }
    
        console.log("Data Table 1 (Revenue Prognosa MTD):", res1.data);
    
        setPopupData1({
          data: res1.data.map((item) => ({
            witel: item?.witel || "-",
            beforeOGP_target: isNaN(Number(item.beforeOGP_target)) ? "" : Number(item.beforeOGP_target),
            beforeOGP_estSust: isNaN(Number(item.beforeOGP_estSust)) ? "" : Number(item.beforeOGP_estSust),
            beforeOGP_billComp: isNaN(Number(item.beforeOGP_billComp)) ? "" : Number(item.beforeOGP_billComp),
            beforeOGP_ol: isNaN(Number(item.beforeOGP_ol)) ? "" : Number(item.beforeOGP_ol),
            beforeOGP_ach: item.beforeOGP_ach ? `${item.beforeOGP_ach}` : "-",
            needScaling: isNaN(Number(item.needScaling)) ? "" : Number(item.needScaling),
            afterOGP_pbAso: isNaN(Number(item.afterOGP_pbAso)) ? "" : Number(item.afterOGP_pbAso),
            afterOGP_inProg: isNaN(Number(item.afterOGP_inProg)) ? "" : Number(item.afterOGP_inProg),
            afterOGP_failed: isNaN(Number(item.afterOGP_failed)) ? "" : Number(item.afterOGP_failed),
            afterOGP_ol: isNaN(Number(item.afterOGP_ol)) ? "" : Number(item.afterOGP_ol),
            afterOGP_ach: item.afterOGP_ach ? `${item.afterOGP_ach}` : "-",
            afterOGP_gmom: item.afterOGP_gmom ? `${item.afterOGP_gmom}` : "-",
            needScalingAfter: isNaN(Number(item.needScalingAfter)) ? "" : Number(item.needScalingAfter),
          })),
        });
    
        setShowAddPopup1(true);
      } catch (error) {
        console.error("Error fetching data for popup:", error);
      }
    };
    
    
    const handleSaveEdit1 = async () => {
      try {
        if (!popupData1?.data || popupData1.data.length === 0) {
          alert("Tidak ada data untuk disimpan.");
          return;
        }
    
        // Kirim langsung popupData1.data jika formatnya sudah sesuai
        const response = await axios.put("http://localhost:5000/api/revenue-prognosa/prognosaMtd", { data: popupData1.data });
    
        console.log("Response dari server setelah update:", response.data);
        
        setTable1((prev) => [...prev, ...popupData1.data]);
        await fetchData();        
        setIsUpdated1(true);
        setTimeout(() => setIsUpdated1(false), 2000); 
        setShowAddPopup1(false);
      } catch (error) {
        console.error("Error saat memperbarui data:", error);
        alert("Terjadi kesalahan saat memperbarui data. Silakan coba lagi.");
      }
    };
  
    
    
    const [popupData1, setPopupData1] = useState({
      data: ["DGS", "PDS", "DSS"].map((witel) => ({
        witel,
        beforeOGP_target: "",
        beforeOGP_estSust: "",
        beforeOGP_billComp: "",
        beforeOGP_ol: "",
        beforeOGP_ach: "",
        needScaling: "",
        afterOGP_pbAso: "",
        afterOGP_inProg: "",
        afterOGP_failed: "",
        afterOGP_ol: "",
        afterOGP_ach: "",
        afterOGP_gmom: "",
        needScalingAfter: "",
      })),
    });
    
    
    const handleUpdateData1 = (e, index, section, field) => {
      if (!popupData1?.data[index]) {
        console.error("Data tidak ditemukan pada indeks:", index);
        return;
      }
    
      // Buat salinan array data
      const updatedData = popupData1.data.map((item, i) =>
        i === index
          ? {
              ...item,
              [section]: section === "beforeOGP" || section === "afterOGP"
                ? { ...item[section], [field]: e.target.value }
                : isNaN(e.target.value) ? e.target.value : Number(e.target.value)
            }
          : item
      );
    
      setPopupData1({ data: updatedData });
    };
    

    const handleEditClick2 = async () => {
      try {
        const res2 = await axios.get("http://localhost:5000/api/revenue-prognosa/prognosaYtd");
    
        if (!Array.isArray(res2.data)) {
          throw new Error("Data yang diterima bukan array.");
        }
    
        console.log("Data Table 2 (Revenue Prognosa YTD):", res2.data);
    
        setPopupData2({
          data: res2.data.map((item) => ({
            witel: item?.witel || "-",
            beforeOGP_target: isNaN(Number(item.beforeOGP_target)) ? "" : Number(item.beforeOGP_target),
            beforeOGP_estSust: isNaN(Number(item.beforeOGP_estSust)) ? "" : Number(item.beforeOGP_estSust),
            beforeOGP_billComp: isNaN(Number(item.beforeOGP_billComp)) ? "" : Number(item.beforeOGP_billComp),
            beforeOGP_ol: isNaN(Number(item.beforeOGP_ol)) ? "" : Number(item.beforeOGP_ol),
            beforeOGP_ach: item.beforeOGP_ach ? `${item.beforeOGP_ach}` : "-",
            needScaling: isNaN(Number(item.needScaling)) ? "" : Number(item.needScaling),
            afterOGP_pbAso: isNaN(Number(item.afterOGP_pbAso)) ? "" : Number(item.afterOGP_pbAso),
            afterOGP_inProg: isNaN(Number(item.afterOGP_inProg)) ? "" : Number(item.afterOGP_inProg),
            afterOGP_failed: isNaN(Number(item.afterOGP_failed)) ? "" : Number(item.afterOGP_failed),
            afterOGP_ol: isNaN(Number(item.afterOGP_ol)) ? "" : Number(item.afterOGP_ol),
            afterOGP_ach: item.afterOGP_ach ? `${item.afterOGP_ach}` : "-",
            afterOGP_gyoy: item.afterOGP_gyoy ? `${item.afterOGP_gyoy}` : "-",
            needScalingAfter: isNaN(Number(item.needScalingAfter)) ? "" : Number(item.needScalingAfter),
          })),
        });
    
        setShowAddPopup2(true);
      } catch (error) {
        console.error("Error fetching data for popup:", error);
      }
    };
    
    
    const handleSaveEdit2 = async () => {
      try {
        if (!popupData2?.data || popupData2.data.length === 0) {
          alert("Tidak ada data untuk disimpan.");
          return;
        }
    
        // Kirim langsung popupData1.data jika formatnya sudah sesuai
        const response = await axios.put("http://localhost:5000/api/revenue-prognosa/prognosaYtd", { data: popupData2.data });
    
        console.log("Response dari server setelah update:", response.data);
        
        setTable2((prev) => [...prev, ...popupData2.data]);
        await fetchData(); 
        setIsUpdated2(true);
        setTimeout(() => setIsUpdated2(false), 2000); 
        setShowAddPopup2(false);
      } catch (error) {
        console.error("Error saat memperbarui data:", error);
        alert("Terjadi kesalahan saat memperbarui data. Silakan coba lagi.");
      }
    };
  
    
    
    const [popupData2, setPopupData2] = useState({
      data: ["DGS", "PDS", "DSS"].map((witel) => ({
        witel,
        beforeOGP_target: "",
        beforeOGP_estSust: "",
        beforeOGP_billComp: "",
        beforeOGP_ol: "",
        beforeOGP_ach: "",
        needScaling: "",
        afterOGP_pbAso: "",
        afterOGP_inProg: "",
        afterOGP_failed: "",
        afterOGP_ol: "",
        afterOGP_ach: "",
        afterOGP_gyoy: "",
        needScalingAfter: "",
      })),
    });
    
    
    const handleUpdateData2 = (e, index, section, field) => {
      if (!popupData2?.data[index]) {
        console.error("Data tidak ditemukan pada indeks:", index);
        return;
      }
    
      // Buat salinan array data
      const updatedData = popupData2.data.map((item, i) =>
        i === index
          ? {
              ...item,
              [section]: section === "beforeOGP" || section === "afterOGP"
                ? { ...item[section], [field]: e.target.value }
                : isNaN(e.target.value) ? e.target.value : Number(e.target.value)
            }
          : item
      );
    
      setPopupData2({ data: updatedData });
    };

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
    

  return (
    <div className="flex h-screen bg-gray-100 overflow-y-scroll no-scrollbar min-h-screen">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 w-64 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      </div>
  
      <div className={`transition-all duration-300 flex-1 flex flex-col ${
        menuOpen ? "md:ml-64 md:w-[calc(100%-16rem)]" : "w-full"
      }`}>

        {/* Navbar */}
        <Navbar
          toggleMenu={() => setMenuOpen(!menuOpen)}
          menuOpen={menuOpen}
        />
        
        <div className="p-6 sm:p-12 mt-24 bg-slate-50 shadow-lg rounded-lg relative w-[95%] mx-auto">
          <h1 className="text-2xl font-bold text-center mb-2">
            Trends Revenue Performance RLEGS - Prognosa
          </h1>
          <div className="w-full border-t-2 border-gray-300 mb-8"></div>

          <div className="absolute top-[100px] left-13 flex items-center space-x-3">
        </div>
        <button onClick={handleEditClick1} className="bg-gray-200 hover:bg-gray-300 p-2 rounded border-2 flex items-center space-x-2 mt-6">
            <FaUpload className="text-gray-700" />
            <span>Update Data</span>
        </button>

        {isUpdated1 && (
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

          {isUpdated2 && (
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
            <div className="overflow-x-auto mt-4 overflow-y-scroll no-scrollbar">
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
                      <td className="border-4 px-4 py-2">{row.beforeOGP?.target ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP?.estSust ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP?.billComp ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP?.ol ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP?.ach ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.needScaling ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP?.pbAso ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP?.inProg ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP?.failed ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP?.ol ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP?.ach ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP?.gmom ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.needScalingAfter ?? "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <hr className="w-full border-t-2 border-gray-300 mt-10" />

            {showAddPopup1 && (
              <div className={`fixed top-0 ${menuOpen ? "left-64 w-[calc(100%-16rem)]" : "left-0 w-full"} h-full bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300`}>
                <div className="bg-white p-8 rounded-lg w-full max-w-5xl mt-10">
                  <h2 className="text-xl font-bold mb-4">Perbarui Data</h2>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-2 border-white text-center">
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
                      {popupData1.data.map((item, rowIndex) => (
                        <tr key={rowIndex} className="border-1 bg-blue-100">
                          {[
                            "witel",
                            "beforeOGP_target",
                            "beforeOGP_estSust",
                            "beforeOGP_billComp",
                            "beforeOGP_ol",
                            "beforeOGP_ach",
                            "needScaling",
                            "afterOGP_pbAso",
                            "afterOGP_inProg",
                            "afterOGP_failed",
                            "afterOGP_ol",
                            "afterOGP_ach",
                            "afterOGP_gmom",
                            "needScalingAfter",
                          ].map((field, colIndex) => (
                            <td
                                className={`px-4 py-2 ${
                                  ["beforeOGP_estSust", "beforeOGP_ol", "beforeOGP_ach", "afterOGP_ol", "afterOGP_ach"].includes(field)
                                    ? "min-w-[70px]"
                                    : ""
                                }`}
                                key={field}
                              >
                              {field === "witel" ? (
                                <span>{item[field]}</span>
                              ) : (
                                <input
                                  type="text"
                                  value={
                                    ["beforeOGP_ach", "afterOGP_ach", "afterOGP_gmom"].includes(field)
                                      ? (item[field] || "").toString().replace(/[^0-9]/g, "") + "%"
                                      : item[field] || ""
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
                                    if (["beforeOGP_ach", "afterOGP_ach", "afterOGP_gmom"].includes(field)) {
                                      // Hanya angka, lalu tambahkan %
                                      val = val.replace(/[^0-9]/g, "") + "%";
                                    } else if (field === "beforeOGP_target") {
                                      val = val.replace(/[^0-9]/g, "");
                                    }

                                    handleUpdateData1({ target: { value: val } }, rowIndex, field);
                                  }}
                                  className={`bg-blue-100 w-full ${
                                    ["beforeOGP_estSust", "beforeOGP_ol", "beforeOGP_ach", "afterOGP_ol", "afterOGP_ach"].includes(field)
                                      ? "min-w-[70px]"
                                      : ""
                                  }`}
                                />
                              )}
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
                        await handleSaveEdit1();
                        setShowAddPopup1(false);
                      }}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      Save Data
                    </button>
                    <button
                      className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
                      onClick={() => setShowAddPopup1(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}



            {/* Jarak antar tabel */}
            <div className="mt-4"></div>

            <div className="absolute top-[100px] left-13 flex items-center space-x-3">
            </div>
            <button onClick={handleEditClick2} className="bg-gray-200 hover:bg-gray-300 p-2 rounded border-2 flex items-center space-x-2 mt-6">
                <FaUpload className="text-gray-700" />
                <span>Update Data</span>
            </button>

            {/* Table 2 */}
            <div className="overflow-x-auto mt-4 overflow-y-scroll no-scrollbar">
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
                      <td className="border-4 px-4 py-2">{row.beforeOGP?.target ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP?.estSust ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP?.billComp ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP?.ol ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.beforeOGP?.ach ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.needScaling ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP?.pbAso ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP?.inProg ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP?.failed ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP?.ol ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP?.ach ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.afterOGP?.gyoy ?? "N/A"}</td>
                      <td className="border-4 px-4 py-2">{row.needScalingAfter ?? "N/A"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>



          {showAddPopup2 && (
              <div className={`fixed top-0 ${menuOpen ? "left-64 w-[calc(100%-16rem)]" : "left-0 w-full"} h-full bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300`}>
                <div className="bg-white p-8 rounded-lg w-full max-w-5xl mt-10">
                  <h2 className="text-xl font-bold mb-4">Perbarui Data</h2>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-2 border-white text-center">
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
                      {popupData2.data.map((item, rowIndex) => (
                        <tr key={rowIndex} className="border-1 bg-blue-100">
                          {[
                            "witel",
                            "beforeOGP_target",
                            "beforeOGP_estSust",
                            "beforeOGP_billComp",
                            "beforeOGP_ol",
                            "beforeOGP_ach",
                            "needScaling",
                            "afterOGP_pbAso",
                            "afterOGP_inProg",
                            "afterOGP_failed",
                            "afterOGP_ol",
                            "afterOGP_ach",
                            "afterOGP_gyoy",
                            "needScalingAfter"
                          ].map((field, colIndex) => (
                            <td
                                className={`px-4 py-2 ${
                                  ["beforeOGP_estSust", "beforeOGP_ol", "beforeOGP_ach", "afterOGP_ol", "afterOGP_ach", "afterOGP_gyoy"].includes(field)
                                    ? "min-w-[70px]"
                                    : ""
                                }`}
                                key={field}
                              >
                              {field === "witel" ? (
                                <span>{item[field]}</span>
                              ) : (
                                <input
                                  type="text"
                                  value={
                                    ["beforeOGP_ach", "afterOGP_ach", "afterOGP_gyoy"].includes(field)
                                      ? (item[field] || "").replace(/[^0-9]/g, "") + "%"
                                      : item[field] || ""
                                  }
                                  onChange={(e) => {
                                    let val = e.target.value;

                                    if (["beforeOGP_ach", "afterOGP_ach", "afterOGP_gyoy"].includes(field)) {
                                      val = val.replace(/[^0-9]/g, "") + "%";
                                    } else if (field === "beforeOGP_target") {
                                      val = val.replace(/[^0-9]/g, "");
                                    }

                                    handleUpdateData2({ target: { value: val } }, rowIndex, field);
                                  }}
                                  className={`bg-blue-100 w-full ${
                                    ["beforeOGP_estSust", "beforeOGP_ol", "beforeOGP_ach", "afterOGP_ol", "afterOGP_ach", "afterOGP_gyoy"].includes(field)
                                      ? "min-w-[70px]"
                                      : ""
                                  }`}
                                  ref={(el) => {
                                    if (!inputRefs.current[rowIndex]) {
                                      inputRefs.current[rowIndex] = [];
                                    }
                                    inputRefs.current[rowIndex][colIndex] = el;
                                  }}
                                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                />
                              )}
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

export default PROGNOSA;
