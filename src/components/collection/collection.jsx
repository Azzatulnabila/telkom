import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import { Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Collection = () => {
  const [activeTab, setActiveTab] = useState("Collection");
  const [menuOpen, setMenuOpen] = useState(true);
  const sidebarRef = useRef(null);
  const [activeBox, setActiveBox] = useState("Segment");
  const [segmentFilter, setSegmentFilter] = useState(null);
  const [collectionData, setCollectionData] = useState({
    Segment: [],
    AM: [],
    "Nama Pelanggan": [],
  });
  
  const [totalTarget, setTotalTarget] = useState(1000);
  const [onlyFilter, setOnlyFilter] = useState({});

  const [showAmPopup, setShowAmPopup] = useState(false);
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const segmentOptions = ["DGS", "DPS", "DSS"];

 
    const [formRows1, setFormRows1] = useState([
      { nama_am: "", segment: "", collected: "", target: "" },
    ]);
  
    const handleChange = (index, field, value) => {
      const updatedRows1 = [...formRows1];
      updatedRows1[index][field] = value;
      setFormRows1(updatedRows1);
    };
  
    const addRow = () => {
      setFormRows1([...formRows1, { nama_am: "", segment: "", collected: "", target: "" }]);
    };
  
    const handleSaveAm = async () => {
      try {
        const mappedData = formRows1.map(row => ({
          nama_am: row.name,
          segment: row.segment,
          collected: row.collected,
          target: row.target
        }));
    
        for (const row of mappedData) {
          await axios.post("http://localhost:5000/api/collection-am", row);
        }
    
        setSavedData((prevData) => [...prevData, ...formRows1]);
        setShowAmPopup(false);
        setShowCustomerPopup(false);
      } catch (err) {
        console.error("Gagal simpan:", err);
      }
    };
    
    const [formRows2, setFormRows2] = useState([
      { nama_pelanggan: "", segment: "", collected: "", target: "" },
    ]);

    const handleChange2 = (index, field, value) => {
      const updatedRows2 = [...formRows2];
      updatedRows2[index][field] = value;
      setFormRows2(updatedRows2);
    };
  
    const addRow2 = () => {
      setFormRows2([...formRows2, { nama_pelanggan: "", segment: "", collected: "", target: "" }]);
    };
  
    const handleSaveCustomer = async () => {
      try {
        const mappedData = formRows2.map(row => ({
          nama_pelanggan : row.nama_pelanggan,
          segment: row.segment,
          collected: row.collected,
          target: row.target
        }));
    
        for (const row of mappedData) {
          await axios.post("http://localhost:5000/api/collection-pelanggan", row);
        }
    
        setSavedData((prevData) => [...prevData, ...formRows2]);
        setShowAmPopup(false);
        setShowCustomerPopup(false);
      } catch (err) {
        console.error("Gagal simpan:", err);
      }
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [segmentRes, amRes, pelangganRes] = await Promise.all([
          axios.get("http://localhost:5000/api/collection-segment"),
          axios.get("http://localhost:5000/api/collection-am"),
          axios.get("http://localhost:5000/api/collection-pelanggan"),
        ]);

        setCollectionData({
          AM: amRes.data,
          "Nama Pelanggan": pelangganRes.data,
        });
      } catch (error) {
        console.error("Gagal fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const getFilteredData = (label) => {
    let data = collectionData[label] || [];

    if (label === "Segment") {
      const allData = [...collectionData["AM"], ...collectionData["Nama Pelanggan"]];
      const grouped = {};
    
      allData.forEach((item) => {
        const seg = item.segment;
        if (!grouped[seg]) grouped[seg] = { collected: 0, target: 0 };
        grouped[seg].collected += Number(item.collected || 0);
        grouped[seg].target += Number(item.target || 0);
      });
    
      let result = Object.entries(grouped).map(([segment, info]) => ({
        segment,
        collected: info.collected,
        target: info.target,
      }));
    
      const only = onlyFilter[label];
      if (only) {
        result = result.filter((item) => item.segment === only);
      }
    
      return result;
    }
    
    const only = onlyFilter[label];
    if (only) {
      data = data.filter((item) => {
        if (label === "Segment") return item.segment === only;
        if (label === "AM") return item.nama_am === only;
        if (label === "Nama Pelanggan") return item.nama_pelanggan === only;
        return true;
      });
      return data;
    }

    if (label === "AM") {
      const grouped = {};
      data.forEach((item) => {
        if (!grouped[item.nama_am])
          grouped[item.nama_am] = { collected: 0, target: 0 };
        grouped[item.nama_am].collected += Number(item.collected || 0);
        grouped[item.nama_am].target += Number(item.target || 0);
      });
      return Object.entries(grouped).map(([nama_am, info]) => ({
        nama_am,
        collected: info.collected,
        target: info.target,
      }));
    }

    if (label === "Nama Pelanggan") {
      const grouped = {};
      data.forEach((item) => {
        if (!grouped[item.nama_pelanggan])
          grouped[item.nama_pelanggan] = { collected: 0, target: 0 };
        grouped[item.nama_pelanggan].collected += Number(item.collected || 0);
        grouped[item.nama_pelanggan].target += Number(item.target || 0);
      });
      return Object.entries(grouped).map(([nama_pelanggan, info]) => ({
        nama_pelanggan,
        collected: info.collected,
        target: info.target,
      }));
    }

    return data;
  };

  const getTotalCollected = (label) => {
    const data = getFilteredData(label);
    return data.reduce((sum, item) => sum + Number(item.collected || 0), 0);
  };

  const getTotalTarget = (label) => {
    const data = getFilteredData(label);
    return data.reduce((sum, item) => sum + Number(item.target || 0), 0);
  };

  const getDoughnutData = (owner) => {
    const isActive = activeBox === owner;
    const collected = getTotalCollected(owner);
    const target = getTotalTarget(owner);
    const activeColor = ["#2196F3", "#E0E0E0"];
    const grayColor = ["#BDBDBD", "#F5F5F5"];

    return {
      labels: ["Collected", "Target"],
      datasets: [
        {
          data: [collected, target],
          backgroundColor: isActive ? activeColor : grayColor,
          borderWidth: 0,
        },
      ],
    };
  };
    

  const doughnutOptions = {
    circumference: 180,
    rotation: -90,
    cutout: "80%",
    plugins: {
      datalabels: {
        display: true,
        formatter: (value) => `${value.toFixed(1)}B`,
        color: "#000",
        font: {
          size: 18,
        },
      },
    },
  };

  const handleOnly = (label, value) => {
    setOnlyFilter((prev) => ({
      ...prev,
      [label]: prev[label] === value ? null : value,
    }));
  };

  return (
    <div className="flex h-screen">
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 sm:w-64`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          menuOpen={menuOpen}
          toggleMenu={() => setMenuOpen(!menuOpen)}
        />
      </div>

      <div
        className={`transition-all duration-300 flex-1 flex flex-col w-full ${
          menuOpen ? "sm:ml-0 md:ml-64" : "ml-0"
        }`}
      >
        {/* Navbar */}
        <Navbar
          toggleMenu={() => setMenuOpen(!menuOpen)}
          menuOpen={menuOpen}
        />
        <main className="flex-1 p-12 bg-gray-100 mt-16 overflow-y-scroll no-scrollbar">
          <h2 className="text-2xl font-bold mb-6">Collection Dashboard</h2>

          <div className="bg-white p-10 rounded-lg shadow-lg">
            <div className="flex space-x-14 mb-12">
              <div className="flex flex-col space-y-12 w-1/4">
                {"Segment,AM,Nama Pelanggan".split(",").map((label) => (
                  <div
                    key={label}
                    className={`p-4 shadow rounded-lg cursor-pointer ${
                      activeBox === label
                        ? "bg-blue-100 font-semibold"
                        : "bg-gray-100"
                    }`}
                    onClick={() => setActiveBox(label)}
                  >
                    {label}
                  </div>
                ))}
              </div>

              <div className="flex flex-row justify-start items-start space-x-6 w-3/4">
                {"Segment,AM,Nama Pelanggan".split(",").map((label) => (
                  <div key={label} className="flex flex-col items-center">
                    <p className="font-semibold mb-2">Chart - {label}</p>
                    <div className="w-64 h-64">
                      <Doughnut
                        data={getDoughnutData(label)}
                        options={doughnutOptions}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between space-x-6">
            {["Segment", "AM", "Nama Pelanggan"].map((label) => (
              <div
                key={label}
                className="w-1/3 bg-gray-50 rounded-lg shadow border p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{label}</span>
                  {label !== "Segment" && ( // Hanya tampilkan tombol + untuk AM dan Nama Pelanggan
                    <button
                      className="text-black px-2 py-1 text-sm font-bold rounded-md"
                      onClick={() => {
                        if (label === "AM") {
                          setShowAmPopup(true); // Pop-up untuk AM
                        } else if (label === "Nama Pelanggan") {
                          setShowCustomerPopup(true); // Pop-up untuk Nama Pelanggan
                        }
                      }}
                    >
                      +
                    </button>
                  )}
                </div>
    
                <div className="max-h-[180px] overflow-y-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr>
                        <th className="border-b pb-1">Nama</th>
                        {label === "Segment" ? null : (
                          <th className="border-b pb-1">Target</th>
                        )}
                        {label === "Segment" ? null : (
                          <th className="border-b pb-1">Collected</th>
                        )}
                        <th className="border-b pb-1">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredData(label).map((item, idx) => {
                        let name = "-";
                        let collected = item.collected || 0;
                        let target = item.target || "-";

                        if (label === "AM") name = item.nama_am;
                        else if (label === "Nama Pelanggan") name = item.nama_pelanggan;
                        else if (label === "Segment") name = item.segment;

                        return (
                          <tr key={idx}>
                            <td className="py-1">{name}</td>
                            {label === "Segment" ? null : <td className="py-1">{target}</td>}
                            {label === "Segment" ? null : (
                              <td className="py-1">{collected}</td>
                            )}
                            <td className="py-1">
                              <button
                                className="text-xs text-blue-600 hover:text-blue-800"
                                onClick={() => handleOnly(label, name)}
                              >
                                {onlyFilter[label] === name ? "Show All" : "Only"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                 </div>
                </div>
              ))}
            </div>
          </div>

          {showAmPopup && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg space-y-4">
              <h3 className="text-lg font-semibold">Tambah Segment (AM)</h3>
              {formRows1.map((row, index) => (
                <div key={index} className="grid grid-cols-4 gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Nama"
                    value={row.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <select
                    value={row.segment}
                    onChange={(e) => handleChange(index, "segment", e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Pilih Segment</option>
                    {segmentOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Collected"
                    value={row.collected}
                    onChange={(e) => handleChange(index, "collected", e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    placeholder="Target"
                    value={row.target}
                    onChange={(e) => handleChange(index, "target", e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                </div>
              ))}

              <div className="flex justify-between mt-4">
                <button
                  onClick={addRow}
                  className="bg-blue-100 text-blue-700 px-4 py-1 rounded hover:bg-blue-200"
                >
                  + Tambah baris
                </button>
                <div className="space-x-2">
                  <button
                    onClick={() => setShowAmPopup(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSaveAm}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

          {showCustomerPopup && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg space-y-4">
                <h3 className="text-lg font-semibold">Tambah Segment (Nama Pelanggan)</h3>
                {formRows2.map((row, index) => (
                  <div key={index} className="grid grid-cols-4 gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Nama"
                      value={row.nama_pelanggan}
                      onChange={(e) => handleChange2 (index, "nama_pelanggan", e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <select
                      value={row.segment}
                      onChange={(e) => handleChange2 (index, "segment", e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Pilih Segment</option>
                      {segmentOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Collected"
                      value={row.collected}
                      onChange={(e) => handleChange2 (index, "collected", e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="number"
                      placeholder="Target"
                      value={row.target}
                      onChange={(e) => handleChange2 (index, "target", e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  </div>
                ))}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={addRow2}
                    className="bg-blue-100 text-blue-700 px-4 py-1 rounded hover:bg-blue-200"
                  >
                    + Tambah baris
                  </button>
                  <div className="space-x-2">
                    <button
                      onClick={() => setShowCustomerPopup(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleSaveCustomer}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Collection;
