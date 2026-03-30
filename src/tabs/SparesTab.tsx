import { useEffect, useState, useMemo } from "react";

type Spare = {
  id: string;
  vehicleNumber: string;
  make: string;
  model: string;
  partName: string;
  quantity: number;
  price: number;
};

const MAKES: Record<string, string[]> = {
  Volvo: ["FH", "FM", "FMX"],
  MAN: ["TGX", "TGS", "TGM"],
  Scania: ["R-series", "S-series", "P-series"],
  FAW: ["J6", "J7", "CA30"],
  HOWO: ["A7", "T5G", "T7H"],
};

function loadSpares(): Spare[] {
  try {
    const raw = localStorage.getItem("spares_state");
    if (!raw) return [];
    return JSON.parse(raw) as Spare[];
  } catch {
    return [];
  }
}

function saveSpares(items: Spare[]) {
  try {
    localStorage.setItem("spares_state", JSON.stringify(items));
  } catch {}
}

export default function SparesTab() {
  const [spares, setSpares] = useState<Spare[]>(() => loadSpares());
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [selectedMake, setSelectedMake] = useState(Object.keys(MAKES)[0] || "");
  const [selectedModel, setSelectedModel] = useState("");
  const [partName, setPartName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    saveSpares(spares);
  }, [spares]);

  useEffect(() => {
    if (selectedMake && MAKES[selectedMake]?.length) {
      setSelectedModel(MAKES[selectedMake][0]);
    }
  }, [selectedMake]);

  const filteredSpares = useMemo(() => {
    return spares.filter(
      (s) =>
        s.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.partName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [spares, searchTerm]);

  function addSpare() {
    if (!vehicleNumber || !selectedMake || !selectedModel || !partName) {
      alert("Please fill all fields");
      return;
    }
    const spare: Spare = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      vehicleNumber,
      make: selectedMake,
      model: selectedModel,
      partName,
      quantity,
      price,
    };
    setSpares((prev) => [spare, ...prev]);
    setVehicleNumber("");
    setPartName("");
    setQuantity(1);
    setPrice(0);
  }

  function removeSpare(id: string) {
    setSpares((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="w-full space-y-6">
      {/* Add Spare Form */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-white font-semibold mb-4">Add Spare Part</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-gray-300 text-sm">Vehicle Number</label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              placeholder="e.g., KBB123"
              className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Truck Make</label>
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
            >
              {Object.keys(MAKES).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-300 text-sm">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
            >
              {(selectedMake ? MAKES[selectedMake] || [] : []).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-gray-300 text-sm">Part Name</label>
            <input
              type="text"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              placeholder="e.g., Engine Oil"
              className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="0"
              className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={addSpare}
              className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-white font-semibold transition"
            >
              Add Part
            </button>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by vehicle number, make, or part name..."
            className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-2 font-semibold text-white">
                  Vehicle #
                </th>
                <th className="text-left px-4 py-2 font-semibold text-white">
                  Make
                </th>
                <th className="text-left px-4 py-2 font-semibold text-white">
                  Model
                </th>
                <th className="text-left px-4 py-2 font-semibold text-white">
                  Part Name
                </th>
                <th className="text-center px-4 py-2 font-semibold text-white">
                  Qty
                </th>
                <th className="text-right px-4 py-2 font-semibold text-white">
                  Price
                </th>
                <th className="text-right px-4 py-2 font-semibold text-white">
                  Total
                </th>
                <th className="text-center px-4 py-2 font-semibold text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSpares.length > 0 ? (
                filteredSpares.map((spare) => (
                  <tr
                    key={spare.id}
                    className="border-b border-gray-800 hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-3 text-yellow-400 font-semibold">
                      {spare.vehicleNumber}
                    </td>
                    <td className="px-4 py-3 text-green-400">{spare.make}</td>
                    <td className="px-4 py-3 text-blue-400">{spare.model}</td>
                    <td className="px-4 py-3">{spare.partName}</td>
                    <td className="text-center px-4 py-3">{spare.quantity}</td>
                    <td className="text-right px-4 py-3">{spare.price}</td>
                    <td className="text-right px-4 py-3 font-semibold text-orange-400">
                      {spare.quantity * spare.price}
                    </td>
                    <td className="text-center px-4 py-3">
                      <button
                        onClick={() => removeSpare(spare.id)}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-red-900 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center px-4 py-6 text-gray-500">
                    No spare parts added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        {filteredSpares.length > 0 && (
          <div className="mt-4 flex justify-end gap-4 text-white">
            <div className="bg-gray-800 px-4 py-2 rounded">
              <span className="text-gray-400 text-sm">Total Parts:</span>{" "}
              <span className="font-semibold">
                {filteredSpares.reduce((sum, s) => sum + s.quantity, 0)}
              </span>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded">
              <span className="text-gray-400 text-sm">Total Value:</span>{" "}
              <span className="font-semibold text-orange-400">
                {filteredSpares.reduce((sum, s) => sum + s.quantity * s.price, 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
