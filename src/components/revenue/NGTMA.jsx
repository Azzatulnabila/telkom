import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import { FaUpload } from "react-icons/fa";
import axios from "axios";

const NGTMAReport = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const sidebarRef = useRef(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [data, setData] = useState([]); 
 
  // GET: Mengambil data
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/revenue-ngtma");
      console.log("Data received:", res.data);

      const filteredData = res.data.map(item => ({
        segment: item.segment,
        ogp: { order: Number(item.ogp_order) || 0, price: Number(item.ogp_price) || 0 },
        mtd: { tgt: Number(item.mtd_tgt) || 0, billcomp_order: Number(item.mtd_billcomp_order) || "0", billcomp_price: Number(item.mtd_billcomp_price) || "0", ach: item.mtd_ach || "-" },
        gmom: item.gmom || "-",
        ytd: { tgt: Number(item.ytd_tgt) || 0, billcomp_order: Number(item.ytd_billcomp_order) || "0", billcomp_price: Number(item.ytd_billcomp_price) || "0", ach: item.ytd_ach || "-" },
        gytd: item.gytd || "-"
      }));

      setData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/revenue-ngtma");
      console.log("Data received:", res.data);
  
      const setData = res.data.map(item => ({
        segment: item.segment || "",
        ogp_order: Number(item.ogp?.order) || 0,
        ogp_price: Number(item.ogp?.price) || 0,
        mtd_tgt: Number(item.mtd?.tgt) || 0,
        mtd_billcomp_order: Number(item.mtd?.billcomp_order) || 0,
        mtd_billcomp_price: Number(item.mtd?.billcomp_price) || 0,
        mtd_ach: item.mtd?.ach || "-",
        gmom: item.gmom || "-",
        ytd_tgt: Number(item.ytd?.tgt) || 0,
        ytd_billcomp_order: Number(item.ytd?.billcomp_order) || 0,
        ytd_billcomp_price: Number(item.ytd?.billcomp_price) || 0,
        ytd_ach: item.ytd?.ach || "-",
        gytd: item.gytd || "-"
      }));
  
      console.log("Formatted Data for Popup:", setData);
  
      setPopupData({ data: res.data });
  

  
      setShowAddPopup(true);
    } catch (error) {
      console.error("Error fetching data for popup:", error);
    }
  };
  

const handleSaveEdit = async () => {
  try {
    if (!popupData?.data || popupData.data.length === 0) {
      alert("Tidak ada data untuk disimpan.");
      return;
    }

    const response = await axios.put("http://localhost:5000/api/revenue-ngtma", { data: popupData.data });

    console.log("Response dari server setelah update:", response.data);
    
    setData((prev) => [...prev, ...popupData.data]);
    await fetchData();


    alert("Data berhasil diperbarui!");
    setShowAddPopup(false);
  } catch (error) {
    console.error("Error saat memperbarui data:", error);
    alert("Terjadi kesalahan saat memperbarui data. Silakan coba lagi.");
  }
};


const [popupData, setPopupData] = useState({
  data: ["DGS", "PDS", "DSS"].map((segment) => ({
    segment,
    ogp_order: 0,
    ogp_price: 0,
    mtd_tgt: 0,
    mtd_billcomp_order: "0",
    mtd_billcomp_price: "0",
    mtd_ach: "-",
    gmom: "-",
    ytd_tgt: 0,
    ytd_billcomp_order: "0",
    ytd_billcomp_price: "0",
    ytd_ach: "-",
    gytd: "-"
  })),
});


const handleUpdateData = (e, key, index) => {
  const { value } = e.target;

  setPopupData((prevState) => {
    const newData = prevState.data.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: isNaN(value) ? value : Number(value) };
      }
      return item;
    });

    return { data: newData };
  });
};

  return (
    <div className="flex h-screen bg-gray-100 overflow-y-scroll no-scrollbar min-h-screen">
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 ${menuOpen ? "translate-x-0" : "-translate-x-full"} w-64 lg:w-64 md:w-48 sm:w-36`}
      >
        <Sidebar menuOpen={menuOpen} toggleMenu={() => setMenuOpen(!menuOpen)} />
      </div>

      <div className={`transition-all duration-300 ${menuOpen ? "ml-0" : "ml-0"} flex-1 flex flex-col ${menuOpen ? "sm:ml-0 md:ml-64" : ""}`}>
        {/* Navbar */}
        <Navbar
          toggleMenu={() => setMenuOpen(!menuOpen)}
          menuOpen={menuOpen}
        />
        <div className="p-6 sm:p-12 mt-24 bg-slate-50 shadow-lg rounded-lg relative w-[95%] mx-auto overflow-y-scroll no-scrollbar">
          <h1 className="text-2xl font-bold text-center mb-2">Trends Revenue Performance RLEGS - Per Witel</h1>
          <div className="w-full border-t-2 border-gray-300 mb-8"></div>

          <button onClick={handleEditClick} className="bg-gray-200 hover:bg-gray-300 p-2 rounded border-2 flex items-center space-x-2 mt-6">
            <FaUpload className="text-gray-700" />
              <span>Update Data</span>
            </button>

          <div className="overflow-x-auto mt-5 overflow-y-scroll no-scrollbar">
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
                  <tr key={index} className="bg-blue-100">
                    <td className="border-4 px-4 py-2 font-bold">{row.segment}</td>
                    <td className="border-4 px-4 py-2">{row.ogp?.order ?? "N/A"}</td>
                    <td className="border-4 px-4 py-2">{row.ogp?.price ?? "N/A"}</td>
                    <td className="border-4 px-4 py-2">{row.mtd?.tgt ?? "N/A"}</td>
                    <td className="border-4 px-4 py-2">{row.mtd?.billcomp_order ?? "N/A"}</td>
                    <td className="border-4 px-4 py-2">{row.mtd?.billcomp_price ?? "N/A"}</td>
                    <td className="border-4 px-4 py-2">{row.mtd?.ach ?? "N/A"}</td>
                    <td className="border-4 px-4 py-2">{row.gmom ?? "N/A"}</td>
                    <td className="border-4 px-4 py-2">{row.ytd?.tgt ?? "N/A"}</td>
                    <td className="border-4 px-4 py-2">{row.ytd?.billcomp_order ?? "N/A"}</td>
                    <td className="border-4 px-4 py-2">{row.ytd?.billcomp_price ?? "N/A"}</td>
                    <td className="border-4 px-4 py-2">{row.ytd?.ach ?? "N/A"}</td>
                    <td className="border-4 px-4 py-2">{row.gytd ?? "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showAddPopup && (
            <div className={`fixed top-0 ${menuOpen ? "left-64 w-[calc(100%-16rem)]" : "left-0 w-full"} h-full bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300`}>
              <div className="bg-white p-8 rounded-lg w-full max-w-5xl mt-10">
                <h2 className="text-xl font-bold mb-4">Popup Data</h2>
                <div className="overflow-x-auto">
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
                     {popupData.data.map((item, index) => (
                        <tr key={index} className="border bg-blue-100">
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={item.segment}
                              onChange={(e) => handleUpdateData(e, "segment", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={item.ogp_order || ""}
                              onChange={(e) => handleUpdateData(e, "ogp_order", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={item.ogp_price || ""}
                              onChange={(e) => handleUpdateData(e, "ogp_price", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={item.mtd_tgt || ""}
                              onChange={(e) => handleUpdateData(e, "mtd_tgt", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={item.mtd_billcomp_order || ""}
                              onChange={(e) => handleUpdateData(e, "mtd_billcomp_order", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={item.mtd_billcomp_price || ""}
                              onChange={(e) => handleUpdateData(e, "mtd_billcomp_price", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={item.mtd_ach || ""}
                              onChange={(e) => handleUpdateData(e, "mtd_ach", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={item.gmom || ""}
                              onChange={(e) => handleUpdateData(e, "gmom", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={item.ytd_tgt || ""}
                              onChange={(e) => handleUpdateData(e, "ytd_tgt", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={item.ytd_billcomp_order || ""}
                              onChange={(e) => handleUpdateData(e, "ytd_billcomp_order", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={item.ytd_billcomp_price || ""}
                              onChange={(e) => handleUpdateData(e, "ytd_billcomp_price", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={item.ytd_ach || ""}
                              onChange={(e) => handleUpdateData(e, "ytd_ach", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={item.gytd || ""}
                              onChange={(e) => handleUpdateData(e, "gytd", index)}
                              className="w-full bg-blue-100"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={async () => {
                      await handleSaveEdit();
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
    </div>
  );
};

export default NGTMAReport;
