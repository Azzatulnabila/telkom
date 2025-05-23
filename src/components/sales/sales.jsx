import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Navbar from "../navbar/navbar";
import { Line, Bar } from "react-chartjs-2";
import { groupBy, sumBy } from "lodash";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Sales = () => {
  const [activeTab, setActiveTab] = useState("Collection");
  const [menuOpen, setMenuOpen] = useState(true);
  const sidebarRef = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [tunggakan, setTunggakan] = useState([]);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    ubis: "", witel: "", am: "", nama_pelanggan: "", partner: "", cr: "", cyc_bill: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/sales-customer")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  const handleAddCustomer = () => {
    setShowAddCustomerModal(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/sales-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan data pelanggan.");
      }
      const savedCustomer = await response.json();
      setCustomers((prev) => [...prev, savedCustomer]);
      setNewCustomer({
        ubis: "", witel: "", am: "", nama_pelanggan: "", partner: "", cr: "", cyc_bill: ""
      });
      setShowAddCustomerModal(false);
    } catch (error) {
      console.error("Terjadi kesalahan saat menyimpan pelanggan:", error);
      alert("Gagal menyimpan data. Silakan coba lagi.");
    }
  };






  useEffect(() => {
    fetch("http://localhost:5000/api/sales-tunggakan")
      .then((res) => res.json())
      .then((data) => setTunggakan(data))
      .catch((err) => console.error("Error fetching tunggakan:", err));
  }, []);

  const totalSales = 25000000;

  // Grafik 1: CR per Witel
    const crPerWitel = Object.entries(
      groupBy(customers, "witel")
    ).map(([witel, list]) => ({
      witel,
      totalCR: sumBy(list, (c) => Number(c.cr)),
    }));

    const crChartData = {
      labels: crPerWitel.map((item) => item.witel),
      datasets: [
        {
          label: "Total CR",
          data: crPerWitel.map((item) => item.totalCR),
          borderColor: "#F0CCD0",
          backgroundColor: "#F0CCD0",
        },
      ],
    };

    // Grafik 2: Saldo Tagihan per Witel
    const saldoPerWitel = Object.entries(
      groupBy(tunggakan, "witel")
    ).map(([witel, list]) => ({
      witel,
      totalSaldo: sumBy(list, (item) => Number(item.saldo_tagihan)),
    }));

const saldoChartData = {
  labels: saldoPerWitel.map((item) => item.witel),
  datasets: [
    {
      label: "Total Saldo Tagihan",
      data: saldoPerWitel.map((item) => item.totalSaldo),
      backgroundColor: "rgb(216, 180, 254)"
    },
  ],
};

  // Fungsi hapus dummy
  const handleDeleteCustomer = (id) => {
    if (window.confirm("Yakin ingin menghapus pelanggan ini?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      // TODO: panggil API hapus data di sini
    }
  };

  const handleDeleteTunggakan = (id) => {
    if (window.confirm("Yakin ingin menghapus tunggakan ini?")) {
      setTunggakan((prev) => prev.filter((t) => t.id !== id));
      // TODO: panggil API hapus data di sini
    }
  };



  const handleAddTunggakan = () => {
    alert("Fungsi tambah data tunggakan belum dibuat");
  };

  // Icon Trash kecil
  const TrashIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-red-600 hover:text-red-800 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
      />
    </svg>
  );

  // Icon Plus kecil
  const PlusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-green-600 hover:text-green-800 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );

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
        <Navbar toggleMenu={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
        <main className="flex-1 p-12 bg-gray-100 mt-16 overflow-y-scroll no-scrollbar">
          <h2 className="text-2xl font-bold mb-6">Sales Dashboard</h2>

          <div className="bg-white p-10 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
            <p className="text-gray-600 mb-2">
              Total Sales: Rp {totalSales.toLocaleString()}
            </p>
            <p className="text-gray-600 mb-2">
              Revenue: Rp {totalSales.toLocaleString()}
            </p>
            <p className="text-gray-600 mb-6">Performance: Stabil</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-6 pr-6">
                <div>
                  <h4 className="font-semibold mb-2">CR per Witel</h4>
                  <Line data={crChartData} height={180} />
                </div>

                <div>
                  <h4 className="font-semibold mb-2 mt-[40px]">Saldo Tagihan per Witel</h4>
                  <Bar data={saldoChartData} height={200} options={{ indexAxis: "y" }} />
                </div>
              </div>

              <div className="flex flex-col gap-6 ml-[-25px]">
                {/* Tabel Data Pelanggan dengan tombol tambah + */}
                <div> 
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold">Data Pelanggan</h2>
                    <button onClick={handleAddCustomer} aria-label="Tambah Pelanggan">
                      {PlusIcon}
                    </button>
                  </div> 
                 <div className="overflow-y-scroll max-h-80 border rounded">
                  <table className="w-full border text-sm">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="bg-gray-100">
                        <th className="border p-2">UBIS</th>
                        <th className="border p-2">WITEL</th>
                        <th className="border p-2">AM</th>
                        <th className="border p-2">Nama</th>
                        <th className="border p-2">Partner</th>
                        <th className="border p-2">CR</th>
                        <th className="border p-2">Cyc Bill</th>
                        <th className="border p-2">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((cust) => (
                        <tr key={cust.id} className="odd:bg-pink-100 even:bg-pink-200">
                          <td className="border p-2">{cust.ubis}</td>
                          <td className="border p-2">{cust.witel}</td>
                          <td className="border p-2">{cust.am}</td>
                          <td className="border p-2">{cust.nama_pelanggan}</td>
                          <td className="border p-2">{cust.partner}</td>
                          <td className="border p-2">{cust.cr}</td>
                          <td className="border p-2">{cust.cyc_bill}</td>
                          <td
                            className="border p-2 text-center"
                            onClick={() => handleDeleteCustomer(cust.id)}
                          >
                            {TrashIcon}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                 </div>
                </div>










                {showAddCustomerModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl">
                      <h2 className="text-xl font-bold mb-4">Tambah Data Customer</h2>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <input
                          type="text"
                          placeholder="UBIS"
                          className="border p-2 rounded"
                          value={newCustomer.ubis}
                          onChange={(e) => setNewCustomer({ ...newCustomer, ubis: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="WITEL"
                          className="border p-2 rounded"
                          value={newCustomer.witel}
                          onChange={(e) => setNewCustomer({ ...newCustomer, witel: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="AM"
                          className="border p-2 rounded"
                          value={newCustomer.am}
                          onChange={(e) => setNewCustomer({ ...newCustomer, am: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Nama Pelanggan"
                          className="border p-2 rounded"
                          value={newCustomer.nama_pelanggan}
                          onChange={(e) =>
                            setNewCustomer({ ...newCustomer, nama_pelanggan: e.target.value })
                          }
                        />
                        <input
                          type="number"
                          placeholder="Partner"
                          className="border p-2 rounded"
                          value={newCustomer.partner}
                          onChange={(e) => setNewCustomer({ ...newCustomer, partner: Number(e.target.value) })}
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="CR"
                          className="border p-2 rounded"
                          value={newCustomer.cr}
                          onChange={(e) => setNewCustomer({ ...newCustomer, cr: Number(e.target.value) })}
                        />
                        <input
                          type="number"
                          placeholder="Cyc Bill"
                          className="border p-2 rounded"
                          value={newCustomer.cyc_bill}
                          onChange={(e) =>
                            setNewCustomer({ ...newCustomer, cyc_bill: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                          onClick={() => setShowAddCustomerModal(false)}
                        >
                          Batal
                        </button>
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          onClick={handleSave}
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  </div>
                )}
















                {/* Tabel Tunggakan Pelanggan dengan tombol tambah + */}
                <div> 
                  <div className="flex items-center justify-between mb-2 mt-[60px]">
                    <h2 className="text-lg font-bold">Tunggakan Pelanggan</h2>
                    <button onClick={handleAddTunggakan} aria-label="Tambah Tunggakan">
                      {PlusIcon}
                    </button>
                  </div>
                  <div className="overflow-y-scroll max-h-80 border rounded">
                  <table className="w-full border text-sm">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="bg-gray-100">
                        <th className="border p-2">UBIS</th>
                        <th className="border p-2">WITEL</th>
                        <th className="border p-2">AM</th>
                        <th className="border p-2">Nama</th>
                        <th className="border p-2">Partner</th>
                        <th className="border p-2">CR</th>
                        <th className="border p-2">Saldo Tagihan</th>
                        <th className="border p-2">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tunggakan.map((item) => (
                        <tr key={item.id} className="odd:bg-purple-50 even:bg-purple-100">
                          <td className="border p-2">{item.ubis}</td>
                          <td className="border p-2">{item.witel}</td>
                          <td className="border p-2">{item.am}</td>
                          <td className="border p-2">{item.nama_pelanggan}</td>
                          <td className="border p-2">{item.partner}</td>
                          <td className="border p-2">{item.cr}</td>
                          <td className="border p-2">
                            Rp {item.saldo_tagihan.toLocaleString()}
                          </td>
                          <td
                            className="border p-2 text-center"
                            onClick={() => handleDeleteTunggakan(item.id)}
                          >
                            {TrashIcon}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                 </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sales;