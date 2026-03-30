import { useEffect, useMemo, useState } from "react";

type Vehicle = {
  id: string;
  vehicleNumber: string;
  make: string;
  model: string;
};

type ExpenseEntry = {
  id: string;
  vehicleNumber: string;
  category: string;
  amount: number;
  date: string;
};

const MAKES: Record<string, string[]> = {
  Volvo: ["FH", "FM", "FMX"],
  MAN: ["TGX", "TGS", "TGM"],
  Scania: ["R-series", "S-series", "P-series"],
  FAW: ["J6", "J7", "CA30"],
  HOWO: ["A7", "T5G", "T7H"],
};

const CATEGORIES = ["Fuel", "Maintenance", "Tyres", "Insurance", "Parts"];

function loadVehicles(): Vehicle[] {
  try {
    const raw = localStorage.getItem("vehicles_registry");
    if (!raw) return [];
    return JSON.parse(raw) as Vehicle[];
  } catch {
    return [];
  }
}

function saveVehicles(items: Vehicle[]) {
  try {
    localStorage.setItem("vehicles_registry", JSON.stringify(items));
  } catch {}
}

function loadExpenses(): ExpenseEntry[] {
  try {
    const raw = localStorage.getItem("vehicle_expenses");
    if (!raw) return [];
    return JSON.parse(raw) as ExpenseEntry[];
  } catch {
    return [];
  }
}

function saveExpenses(items: ExpenseEntry[]) {
  try {
    localStorage.setItem("vehicle_expenses", JSON.stringify(items));
  } catch {}
}

export default function TruckMakeTab() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => loadVehicles());
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(() => loadExpenses());
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form states for registering vehicle
  const [regVehicleNumber, setRegVehicleNumber] = useState("");
  const [regMake, setRegMake] = useState(Object.keys(MAKES)[0] || "");
  const [regModel, setRegModel] = useState("");

  // Form states for adding expense
  const [expCategory, setExpCategory] = useState(CATEGORIES[0]);
  const [expAmount, setExpAmount] = useState(0);

  useEffect(() => saveVehicles(vehicles), [vehicles]);

  useEffect(() => saveExpenses(expenses), [expenses]);

  useEffect(() => {
    if (regMake && MAKES[regMake]?.length) {
      setRegModel(MAKES[regMake][0]);
    }
  }, [regMake]);

  // Register new vehicle
  function registerVehicle() {
    if (!regVehicleNumber || !regMake || !regModel) {
      alert("Please fill all fields");
      return;
    }
    if (vehicles.some((v) => v.vehicleNumber.toUpperCase() === regVehicleNumber.toUpperCase())) {
      alert("Vehicle number already registered");
      return;
    }
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      vehicleNumber: regVehicleNumber.toUpperCase(),
      make: regMake,
      model: regModel,
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    setRegVehicleNumber("");
    setSelectedVehicle(newVehicle);
  }

  // Add expense for selected vehicle
  function addExpense() {
    if (!selectedVehicle || expAmount <= 0) {
      alert("Select a vehicle and enter amount");
      return;
    }
    const newExpense: ExpenseEntry = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      vehicleNumber: selectedVehicle.vehicleNumber,
      category: expCategory,
      amount: expAmount,
      date: new Date().toISOString().split("T")[0],
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setExpAmount(0);
  }

  // Remove vehicle
  function removeVehicle(vehicleId: string) {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    if (selectedVehicle?.id === vehicleId) {
      setSelectedVehicle(null);
    }
  }

  // Remove expense
  function removeExpense(expenseId: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  }

  // Get expenses for selected vehicle
  const vehicleExpenses = useMemo(() => {
    if (!selectedVehicle) return [];
    return expenses.filter((e) => e.vehicleNumber === selectedVehicle.vehicleNumber);
  }, [expenses, selectedVehicle]);

  // Calculate totals by category for selected vehicle
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    CATEGORIES.forEach((c) => (totals[c] = 0));
    vehicleExpenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return totals;
  }, [vehicleExpenses]);

  const maxVal = Math.max(...Object.values(categoryTotals), 1);

  return (
    <div className="w-full space-y-6">
      {/* Register Vehicle Section */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-white font-semibold mb-4">Register Vehicle</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-gray-300 text-sm">Vehicle Number</label>
            <input
              type="text"
              value={regVehicleNumber}
              onChange={(e) => setRegVehicleNumber(e.target.value.toUpperCase())}
              placeholder="e.g., KBB123Q"
              className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Make</label>
            <select
              value={regMake}
              onChange={(e) => setRegMake(e.target.value)}
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
              value={regModel}
              onChange={(e) => setRegModel(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
            >
              {(regMake ? MAKES[regMake] || [] : []).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={registerVehicle}
              className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white font-semibold transition"
            >
              Register
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-white font-semibold mb-4">Registered Vehicles</h3>
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
                <th className="text-center px-4 py-2 font-semibold text-white">
                  Entries
                </th>
                <th className="text-center px-4 py-2 font-semibold text-white">
                  Total Spent
                </th>
                <th className="text-center px-4 py-2 font-semibold text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => {
                  const vehExpenses = expenses.filter(
                    (e) => e.vehicleNumber === vehicle.vehicleNumber
                  );
                  const totalSpent = vehExpenses.reduce(
                    (sum, e) => sum + e.amount,
                    0
                  );
                  return (
                    <tr
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className={`border-b border-gray-800 cursor-pointer transition ${
                        selectedVehicle?.id === vehicle.id
                          ? "bg-blue-900"
                          : "hover:bg-gray-800"
                      }`}
                    >
                      <td className="px-4 py-3 text-yellow-400 font-semibold">
                        {vehicle.vehicleNumber}
                      </td>
                      <td className="px-4 py-3 text-green-400">{vehicle.make}</td>
                      <td className="px-4 py-3 text-blue-400">{vehicle.model}</td>
                      <td className="text-center px-4 py-3">
                        <span className="bg-gray-800 px-2 py-1 rounded">
                          {vehExpenses.length}
                        </span>
                      </td>
                      <td className="text-center px-4 py-3 font-semibold text-orange-400">
                        {totalSpent}
                      </td>
                      <td className="text-center px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeVehicle(vehicle.id);
                          }}
                          className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-red-900 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center px-4 py-6 text-gray-500">
                    No vehicles registered yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense and Chart - Only if vehicle selected */}
      {selectedVehicle && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Expense Form */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-4">
              Add Expense - {selectedVehicle.vehicleNumber}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-300 text-sm">Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 text-sm">Amount</label>
                <input
                  type="number"
                  value={expAmount}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  placeholder="0"
                  className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
                />
              </div>

              <button
                onClick={addExpense}
                className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-white font-semibold transition"
              >
                Add Expense
              </button>
            </div>

            {/* Entries List */}
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">
                Total Entries: {vehicleExpenses.length}
              </h4>
              <div className="space-y-2 max-h-48 overflow-auto">
                {vehicleExpenses.length > 0 ? (
                  vehicleExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex justify-between items-center gap-2 bg-gray-800 px-3 py-2 rounded"
                    >
                      <div className="text-xs flex-1">
                        <span className="text-green-400">{exp.category}</span> —{" "}
                        <span className="text-yellow-300 font-semibold">
                          {exp.amount}
                        </span>{" "}
                        <span className="text-gray-500">({exp.date})</span>
                      </div>
                      <button
                        onClick={() => removeExpense(exp.id)}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-red-900 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-xs text-center py-4">
                    No expenses yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expense Breakdown Chart */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Expense Breakdown</h3>

            {/* SVG Bar Chart */}
            <div className="mb-6 bg-gray-800 p-4 rounded">
              <svg viewBox="0 0 300 180" className="w-full h-40">
                {CATEGORIES.map((c, i) => {
                  const x = 10 + i * 56;
                  const h = (categoryTotals[c] / maxVal) * 130;
                  return (
                    <g key={c}>
                      <rect
                        x={x}
                        y={140 - h}
                        width={44}
                        height={h}
                        fill="#ef4444"
                        opacity={0.85}
                        rx={3}
                      />
                      <text
                        x={x + 22}
                        y={158}
                        fontSize={11}
                        fill="#cbd5e1"
                        textAnchor="middle"
                      >
                        {c.slice(0, 3)}
                      </text>
                      <text
                        x={x + 22}
                        y={135 - h}
                        fontSize={9}
                        fill="#fecaca"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {categoryTotals[c] > 0 ? categoryTotals[c] : ""}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Category Summary */}
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat}
                  className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded"
                >
                  <span className="text-gray-300 text-sm">{cat}</span>
                  <span className="font-semibold text-orange-400">
                    {categoryTotals[cat]}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between items-center bg-gray-800 px-3 py-2 rounded font-semibold">
                <span className="text-white">TOTAL</span>
                <span className="text-yellow-400 text-lg">
                  {Object.values(categoryTotals).reduce((a, b) => a + b, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Vehicle Selected Message */}
      {!selectedVehicle && vehicles.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg text-center">
          <p className="text-gray-400">
            Click on a vehicle from the table above to view and add expenses
          </p>
        </div>
      )}
    </div>
  );
}
