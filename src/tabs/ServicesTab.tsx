
import React, { useState, useMemo } from "react";
import { useDashboard } from "../context/DashboardContext";
import { Trash2, Plus, Search } from "lucide-react";

function ServicesTab() {
  const { services, addService, removeService } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [inlineInput, setInlineInput] = useState({
    date: "",
    accessories: "",
    issuedBy: "",
    fittedBy: "",
    approvedBy: "",
    truckNumber: "",
  });

  const filtered = useMemo(() => {
    return services.filter((s) =>
      s.date.includes(searchTerm) ||
      s.accessories.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.issuedBy || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.fittedBy || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.approvedBy || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.truckNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [services, searchTerm]);

  const handleInlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInlineInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleInlineSubmit = () => {
    if (
      inlineInput.date &&
      inlineInput.accessories &&
      inlineInput.issuedBy &&
      inlineInput.fittedBy &&
      inlineInput.approvedBy
    ) {
      addService({
        date: inlineInput.date,
        accessories: inlineInput.accessories,
        issuedBy: inlineInput.issuedBy,
        fittedBy: inlineInput.fittedBy,
        approvedBy: inlineInput.approvedBy,
        truckNumber: inlineInput.truckNumber || undefined,
      });
      setInlineInput({ date: "", accessories: "", issuedBy: "", fittedBy: "", approvedBy: "", truckNumber: "" });
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-2xl relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by date, accessories, or person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800">
                <th className="px-6 py-3 text-left text-gray-300 font-semibold text-sm">Date</th>
                <th className="px-6 py-3 text-left text-gray-300 font-semibold text-sm">Accessories</th>
                <th className="px-6 py-3 text-left text-gray-300 font-semibold text-sm">Truck Number</th>
                <th className="px-6 py-3 text-left text-gray-300 font-semibold text-sm">Issued By</th>
                <th className="px-6 py-3 text-left text-gray-300 font-semibold text-sm">Fitted By</th>
                <th className="px-6 py-3 text-left text-gray-300 font-semibold text-sm">Approved By</th>
                <th className="px-6 py-3 text-center text-gray-300 font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <p className="text-gray-400">{services.length === 0 ? "No services logged yet" : "No services match your search"}</p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="px-6 py-4 text-white text-sm text-center">{s.date}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm text-center">{s.accessories}</td>
                    <td className="px-6 py-4 text-white text-sm text-center">{s.truckNumber || "-"}</td>
                    <td className="px-6 py-4 text-white text-sm text-center">{s.issuedBy}</td>
                    <td className="px-6 py-4 text-white text-sm text-center">{s.fittedBy}</td>
                    <td className="px-6 py-4 text-white text-sm text-center">{s.approvedBy}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => removeService(s.id)} className="p-2 text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}

              {/* Inline Input Row */}
              <tr className="border-t-2 border-blue-600 bg-gray-800 hover:bg-gray-700 transition">
                <td className="px-6 py-4">
                  <input type="date" name="date" value={inlineInput.date} onChange={handleInlineChange} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500" />
                </td>
                <td className="px-6 py-4">
                  <input type="text" name="accessories" value={inlineInput.accessories} onChange={handleInlineChange} placeholder="Accessories" className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500" />
                </td>
                <td className="px-6 py-4">
                  <input type="text" name="truckNumber" value={inlineInput.truckNumber} onChange={handleInlineChange} placeholder="Truck No." className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500" />
                </td>
                <td className="px-6 py-4">
                  <input type="text" name="issuedBy" value={inlineInput.issuedBy} onChange={handleInlineChange} placeholder="Issued By" className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500" />
                </td>
                <td className="px-6 py-4">
                  <input type="text" name="fittedBy" value={inlineInput.fittedBy} onChange={handleInlineChange} placeholder="Fitted By" className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500" />
                </td>
                <td className="px-6 py-4">
                  <input type="text" name="approvedBy" value={inlineInput.approvedBy} onChange={handleInlineChange} placeholder="Approved By" className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500" />
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={handleInlineSubmit} className="p-2 text-green-400 hover:bg-green-900 hover:bg-opacity-30 rounded-lg transition font-bold">
                    <Plus className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Total ({filtered.length} items):</span>
            <span className="text-white text-sm font-medium">Logged services</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesTab;
