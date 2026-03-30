import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";
import { useDashboard } from "../context/DashboardContext";

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

export function OverviewTab() {
  const { diesel, salary, insurance, products, mileage } = useDashboard();

  // Calculate totals
  const totalDiesel = useMemo(
    () => diesel.reduce((sum, item) => sum + item.amount, 0),
    [diesel]
  );

  const totalSalary = useMemo(
    () => salary.reduce((sum, item) => sum + item.amount, 0),
    [salary]
  );

  const totalInsurance = useMemo(
    () => insurance.reduce((sum, item) => sum + item.amount, 0),
    [insurance]
  );

  const totalMileage = useMemo(
    () => mileage.reduce((sum, item) => sum + (item.mileage || 0), 0),
    [mileage]
  );

  // Calculate total KES and USD expenses
  const totalKESExpenses = useMemo(() => {
    const dieselTotal = diesel.reduce((sum, item) => sum + item.amount, 0);
    const salaryTotal = salary.reduce((sum, item) => sum + item.amount, 0);
    const insuranceTotal = insurance.reduce((sum, item) => sum + item.amount, 0);
    const productsTotal = products.reduce((sum, item) => sum + item.price, 0);
    const mileageKESTotal = mileage.filter(m => m.currency === 'KES').reduce((sum, item) => sum + item.amount, 0);
    return dieselTotal + salaryTotal + insuranceTotal + productsTotal + mileageKESTotal;
  }, [diesel, salary, insurance, products, mileage]);

  const totalUSDExpenses = useMemo(() => {
    return mileage.filter(m => m.currency === 'USD').reduce((sum, item) => sum + item.amount, 0);
  }, [mileage]);

  // Chart data with dates
  const expenseChartData = [
    { name: "Diesel", amount: totalDiesel },
    { name: "Salary", amount: totalSalary },
    { name: "Insurance", amount: totalInsurance },
  ];

  // Timeline data - Daily expenses
  const timelineData = useMemo(() => {
    const dateMap = new Map<string, any>();
    
    diesel.forEach((item) => {
      const key = item.date;
      if (!dateMap.has(key)) {
        dateMap.set(key, { date: key, Diesel: 0, Salary: 0, Insurance: 0, Mileage: 0, month: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
      }
      dateMap.get(key).Diesel += item.amount;
    });
    
    salary.forEach((item) => {
      const key = item.date;
      if (!dateMap.has(key)) {
        dateMap.set(key, { date: key, Diesel: 0, Salary: 0, Insurance: 0, Mileage: 0, month: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
      }
      dateMap.get(key).Salary += item.amount;
    });
    
    insurance.forEach((item) => {
      const key = item.date;
      if (!dateMap.has(key)) {
        dateMap.set(key, { date: key, Diesel: 0, Salary: 0, Insurance: 0, Mileage: 0, month: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
      }
      dateMap.get(key).Insurance += item.amount;
    });

    mileage.forEach((item) => {
      const key = item.date;
      if (!dateMap.has(key)) {
        dateMap.set(key, { date: key, Diesel: 0, Salary: 0, Insurance: 0, Mileage: 0, month: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
      }
      dateMap.get(key).Mileage += item.mileage || 0;
    });

    return Array.from(dateMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [diesel, salary, insurance, mileage]);

  const pieData = [
    { name: "Diesel", value: totalDiesel },
    { name: "Salary", value: totalSalary },
    { name: "Insurance", value: totalInsurance },
    { name: "Mileage", value: totalMileage },
  ].filter((item) => item.value > 0);

  return (
    <div className="w-full space-y-8">
      {/* Short description to explain chart labels */}
      <div className="text-center">
        <h2 className="text-white text-2xl font-bold">Overview — Charts</h2>
        <p className="text-gray-400 mt-2">Charts show expenses by date (e.g. "Nov 22") and month abbreviations for clarity.</p>
      </div>

      {/* Currency Expenses Chart - Moved to top */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-white font-bold text-xl mb-4">💰 Total Expenses by Currency</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ currency: "KES", amount: totalKESExpenses }, { currency: "USD", amount: totalUSDExpenses }]} margin={{ top: 8, right: 16, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} stroke="#374151" />
              <XAxis dataKey="currency" tick={{ fill: '#e5e7eb', fontSize: 14, fontWeight: 700 }}>
                <Label value="Currency" position="bottom" offset={12} fill="#e5e7eb" />
              </XAxis>
              <YAxis tick={{ fill: '#e5e7eb', fontSize: 13 }}>
                <Label value="Amount" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#e5e7eb', fontSize: 13 }} />
              </YAxis>
              <Tooltip formatter={(value, name) => [`${name === 'KES' ? 'KES' : '$'}${(value as number).toLocaleString()}`, 'Amount']} contentStyle={{ fontSize: 14, padding: 10 }} />
              <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline Chart Card */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-white font-bold text-xl mb-4">📅 Timeline — Expenses by Date</h3>
        {timelineData.length > 0 ? (
          <div style={{ width: '100%', height: 500 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 12, right: 20, left: 0, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.14} stroke="#374151" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} tick={{ fill: '#e5e7eb', fontSize: 13, fontWeight: 700 }} />
                <YAxis tick={{ fill: '#e5e7eb', fontSize: 13, fontWeight: 600 }}>
                  <Label value="Amount (KES)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#e5e7eb', fontSize: 13 }} />
                </YAxis>
                <Tooltip formatter={(value) => `KES ${(value as number).toLocaleString()}`} labelFormatter={(label) => `Date: ${label}`} contentStyle={{ backgroundColor: '#0f1720', borderRadius: 10, color: '#fff', fontSize: 14, padding: 12 }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Diesel" fill="#ef4444" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Salary" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Insurance" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Mileage" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-400">No timeline data available.</p>
        )}
      </div>

      {/* Expense Breakdown Chart Card */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-white font-bold text-xl mb-4">📊 Expense Breakdown</h3>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseChartData} margin={{ top: 8, right: 16, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: '#e5e7eb', fontSize: 14, fontWeight: 700 }}>
                  <Label value="Category" position="bottom" offset={12} fill="#e5e7eb" />
                </XAxis>
                <YAxis tick={{ fill: '#e5e7eb', fontSize: 13 }}>
                  <Label value="Amount (KES)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#e5e7eb', fontSize: 13 }} />
                </YAxis>
                <Tooltip formatter={(value) => `KES ${(value as number).toLocaleString()}`} contentStyle={{ fontSize: 14, padding: 10 }} />
              <Bar dataKey="amount" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Distribution Pie Chart Card */}
      {pieData.length > 0 && (
        <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-white font-bold text-xl mb-4">📈 Expense Distribution</h3>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={120} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: KES ${value.toLocaleString()}`}>
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `KES ${(value as number).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Vehicle Expense Overview Section */}
      <VehicleExpenseOverview />

      {/* Spares Usage Tracking Section */}
      <SparesUsageOverview />
    </div>
  );
}

// Vehicle Expense Overview Component
function VehicleExpenseOverview() {
  const vehicles = useMemo(() => {
    try {
      const raw = localStorage.getItem("vehicles_registry");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const expenses = useMemo(() => {
    try {
      const raw = localStorage.getItem("vehicle_expenses");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const CATEGORIES = ["Fuel", "Maintenance", "Tyres", "Insurance", "Parts"];

  const vehicleData = useMemo(() => {
    return vehicles.map((vehicle: any) => {
      const vehExpenses = expenses.filter((e: any) => e.vehicleNumber === vehicle.vehicleNumber);
      const categoryTotals: Record<string, number> = {};
      CATEGORIES.forEach((c) => (categoryTotals[c] = 0));
      vehExpenses.forEach((e: any) => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      });

      const totalSpent = Object.values(categoryTotals).reduce((a: any, b: any) => a + b, 0);

      return {
        vehicleNumber: vehicle.vehicleNumber,
        make: vehicle.make,
        model: vehicle.model,
        entries: vehExpenses.length,
        totalSpent,
        categories: Object.entries(categoryTotals).map(([name, value]) => ({
          name,
          value,
        })),
      };
    });
  }, [vehicles, expenses]);

  if (vehicleData.length === 0) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg text-center text-gray-500">
        No vehicles registered yet
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-white text-2xl font-bold mb-6">🚚 Vehicle Expense Overview</h3>
      <div className="grid grid-cols-1 gap-8">
        {vehicleData.map((vehicle: any, idx: number) => (
          <div key={idx} className="bg-gray-900 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-white text-xl font-bold">{vehicle.vehicleNumber}</h4>
                <p className="text-gray-400 text-sm">
                  {vehicle.make} / {vehicle.model}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Total Spent</p>
                <p className="text-yellow-400 text-2xl font-bold">
                  KES {vehicle.totalSpent.toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs mt-1">{vehicle.entries} entries</p>
              </div>
            </div>

            {vehicle.totalSpent > 0 && (
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vehicle.categories}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => `KES ${(value as number).toLocaleString()}`}
                      contentStyle={{ backgroundColor: "#1f2937", borderRadius: 8, border: "1px solid #374151" }}
                    />
                    <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Spares Usage Tracking Component
function SparesUsageOverview() {
  const spares = useMemo(() => {
    try {
      const raw = localStorage.getItem("spares_state");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const sparesByMake = useMemo(() => {
    const grouped: Record<string, { make: string; total: number; totalSpent: number; parts: number }> = {};

    spares.forEach((spare: any) => {
      const key = `${spare.make}`;
      if (!grouped[key]) {
        grouped[key] = {
          make: spare.make,
          total: 0,
          totalSpent: 0,
          parts: 0,
        };
      }
      grouped[key].total += spare.quantity;
      grouped[key].totalSpent += spare.quantity * spare.price;
      grouped[key].parts += 1;
    });

    return Object.values(grouped);
  }, [spares]);

  const chartData = useMemo(() => {
    return sparesByMake.map((item) => ({
      name: item.make,
      "Total Qty": item.total,
      "Total Value": item.totalSpent,
      "Parts Count": item.parts,
    }));
  }, [sparesByMake]);

  if (spares.length === 0) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg text-center text-gray-500">
        No spare parts tracked yet
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-white text-2xl font-bold mb-6">🔧 Spares Usage by Make</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h4 className="text-white font-bold mb-4">Spare Parts by Make</h4>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => {
                    if (typeof value === "number" && value > 1000) {
                      return `KES ${(value as number).toLocaleString()}`;
                    }
                    return value;
                  }}
                  contentStyle={{ backgroundColor: "#1f2937", borderRadius: 8, border: "1px solid #374151" }}
                />
                <Legend />
                <Bar dataKey="Total Qty" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Total Value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h4 className="text-white font-bold mb-4">Spares Summary by Make</h4>
          <div className="space-y-3">
            {sparesByMake.map((item, idx) => (
              <div key={idx} className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">{item.make}</span>
                  <span className="text-xs bg-blue-900 px-2 py-1 rounded text-blue-300">
                    {item.parts} parts
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Total Qty</p>
                    <p className="text-green-400 font-bold">{item.total}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Value</p>
                    <p className="text-orange-400 font-bold">
                      KES {item.totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

