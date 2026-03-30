import { useState } from "react";
import { useDashboard } from "../context/DashboardContext";

export function ReportsTab() {
  const { diesel, salary, insurance, mileage, reportSelection, setReportSelection } = useDashboard();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const [startDate, setStartDate] = useState(startOfMonth.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);
  const [results, setResults] = useState<any[]>([]);

  function inTimeframe(dStr: string) {
    const d = new Date(dStr);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end date
    return d >= start && d <= end;
  }

  function total(list: any[]) {
    return list.reduce((acc, x) => {
      const amount = Number(x.amount || 0);
      if ((x.category === "Mileage" || x.category === "Mileage In" || x.category === "Mileage Out")) {
        if (x.currency === "USD") {
          return acc + (amount * exchangeRate);
        } else {
          return acc + amount;
        }
      } else {
        return acc;
      }
    }, 0);
  }

  function totalUSD(list: any[]) {
    return list.reduce((acc, x) => {
      const amount = Number(x.amount || 0);
      if ((x.category === "Mileage" || x.category === "Mileage In" || x.category === "Mileage Out") && x.currency === "USD") {
        return acc + amount;
      } else {
        return acc;
      }
    }, 0);
  }

  const generate = () => {
    const res: any[] = [];

    if (reportSelection.diesel) {
      diesel.forEach((d: any) => {
        if (!inTimeframe(d.date)) return;
        res.push({ category: "Diesel", ...d });
      });
    }

    if (reportSelection.salary) {
      salary.forEach((s: any) => {
        if (!inTimeframe(s.date)) return;
        res.push({ category: "Salary", ...s });
      });
    }

    if (reportSelection.insurance) {
      insurance.forEach((ins: any) => {
        if (!inTimeframe(ins.date)) return;
        res.push({ category: "Insurance", ...ins });
      });
    }

    if (reportSelection.mileage) {
      // Group mileage by type
      const mileageIn = mileage.filter((m: any) => inTimeframe(m.date) && m.type === 'in');
      const mileageOut = mileage.filter((m: any) => inTimeframe(m.date) && m.type === 'out');

      // Add Mileage In entries
      if (mileageIn.length > 0) {
        res.push({ category: "Mileage", type: "Mileage In", isGroupHeader: true });
        mileageIn.forEach((m: any) => {
          res.push({ category: "Mileage In", type: "Mileage In", ...m });
        });
      }

      // Add Mileage Out entries
      if (mileageOut.length > 0) {
        res.push({ category: "Mileage", type: "Mileage Out", isGroupHeader: true });
        mileageOut.forEach((m: any) => {
          res.push({ category: "Mileage Out", type: "Mileage Out", ...m });
        });
      }
    }

    res.sort((a, b) => {
      // Sort by category order, then by date within categories
      const categoryOrder = { "Salary": 1, "Diesel": 2, "Insurance": 3, "Mileage": 4 };
      const aOrder = categoryOrder[a.category as keyof typeof categoryOrder] || 5;
      const bOrder = categoryOrder[b.category as keyof typeof categoryOrder] || 5;

      if (aOrder !== bOrder) return aOrder - bOrder;

      // For mileage, sort headers first, then entries by date
      if (a.category === "Mileage" && b.category === "Mileage") {
        if (a.isGroupHeader && !b.isGroupHeader) return -1;
        if (!a.isGroupHeader && b.isGroupHeader) return 1;
        if (a.isGroupHeader && b.isGroupHeader) return a.type.localeCompare(b.type);
      }

      return new Date(b.date || '1970-01-01').getTime() - new Date(a.date || '1970-01-01').getTime();
    });

    setResults(res);
  };

  const exchangeRate = 129; // USD to KES

  const printReport = () => {
    if (!results || results.length === 0) return;
    const now = new Date();
    const title = `Report - ${now.toLocaleString()}`;

    // Separate results by category
    const salaryResults = results.filter(r => r.category === "Salary");
    const dieselResults = results.filter(r => r.category === "Diesel");
    const insuranceResults = results.filter(r => r.category === "Insurance");
    const mileageInResults = results.filter(r => r.category === "Mileage In" && !r.isGroupHeader);
    const mileageOutResults = results.filter(r => r.category === "Mileage Out" && !r.isGroupHeader);

    const createTable = (categoryName: string, data: any[]) => {
      if (data.length === 0) return "";
      let rows = "";
      data.forEach((r: any) => {
        const date = r.date ? new Date(r.date).toLocaleDateString() : "-";
        const cat = r.category || "";
        const details = [r.vehicle, r.country, r.county, r.company].filter(x => x).join(" • ") || (r.litres ? `${r.litres} L` : ((r.category === "Mileage" || r.category === "Mileage In" || r.category === "Mileage Out") ? `${r.mileage || 0} km` : ""));
        const amount = r.amount ? Number(r.amount).toLocaleString() + (r.currency === "USD" ? " $" : " KES") : "";
        rows += `<tr style="border-bottom:1px solid #ddd"><td style="padding:8px">${date}</td><td style="padding:8px">${cat}</td><td style="padding:8px">${details}</td><td style="padding:8px;text-align:right">${amount}</td></tr>`;
      });

      let totalRow = "";
      if (categoryName === "Mileage In" || categoryName === "Mileage Out") {
        const totalAmount = data.reduce((acc, r) => acc + Number(r.amount || 0), 0);
        const allUSD = data.every(r => r.currency === "USD");
        const totalDisplay = allUSD ? `$${totalAmount.toLocaleString()}` : `${totalAmount.toLocaleString()} KES`;
        totalRow = `<tr style="background-color:#f1f5f9;font-weight:bold;"><td colspan="3" style="padding:8px;text-align:right;">Total ${categoryName}:</td><td style="padding:8px;text-align:right;">${totalDisplay}</td></tr>`;
      }

      return `
        <h3 style="margin-top: 30px; margin-bottom: 10px; color: #1e40af;">${categoryName}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <thead>
            <tr><th style="background-color: #3b82f6; color: white; padding: 12px; text-align: left; font-weight: bold;">Date</th><th style="background-color: #3b82f6; color: white; padding: 12px; text-align: left; font-weight: bold;">Category</th><th style="background-color: #3b82f6; color: white; padding: 12px; text-align: left; font-weight: bold;">Details</th><th style="background-color: #3b82f6; color: white; padding: 12px; text-align: right; font-weight: bold;">Amount</th></tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          ${totalRow ? `<tfoot>${totalRow}</tfoot>` : ""}
        </table>
      `;
    };

    const totalMileageKES = total(results).toLocaleString();
    const totalMileageUSD = totalUSD(results).toFixed(2);

    const html = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; color: #333; margin: 20px; }
            .header { text-align: center; background-color: #1e40af; color: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
            .header h1 { margin: 0; font-size: 28px; }
            .header h2 { margin: 5px 0 0 0; font-size: 18px; font-weight: normal; }
            .report-info { text-align: center; margin-bottom: 20px; font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; font-weight: bold; }
            th:last-child { text-align: right; }
            td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            td:last-child { text-align: right; }
            tbody tr:hover { background-color: #f8fafc; }
            tfoot { background-color: #f1f5f9; }
            tfoot td { font-weight: bold; color: #1e40af; }
            h3 { font-size: 18px; margin-top: 30px; margin-bottom: 10px; color: #1e40af; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Rashid Amir Transporters Limited</h1>
            <h2>Financial Report</h2>
          </div>
          <div class="report-info">
            <strong>${title}</strong><br>
            Generated: ${now.toLocaleString()}
          </div>
          ${createTable("Salary", salaryResults)}
          ${createTable("Diesel", dieselResults)}
          ${createTable("Insurance", insuranceResults)}
          ${createTable("Mileage In", mileageInResults)}
          ${createTable("Mileage Out", mileageOutResults)}
          <div style="margin-top: 40px; text-align: right; font-size: 16px; font-weight: bold; color: #1e40af;">
            <div>Exchange Rate: 1 USD = ${exchangeRate} KES</div>
            <div>Total Mileage: ${totalMileageKES} KES</div>
            <div>Total in USD: $${totalMileageUSD} USD</div>
          </div>
        </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => {
        w.focus();
        w.print();
      }, 200);
    }
  };

  function formatShort(d?: string) {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
  }

  return (
    <div className="w-full px-6 py-8 mx-auto max-w-6xl">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-semibold">Reports</h1>
        <p className="text-sm text-gray-400 mt-1">Generate detailed reports for all funds</p>
      </header>

      <div className="bg-gray-900 rounded-lg p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-800 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-800 p-2 rounded w-full"
            />
          </div>
          <div className="flex gap-2 items-end">
            <button onClick={generate} className="px-4 py-2 bg-blue-600 rounded">Generate Report</button>
            <button onClick={printReport} disabled={results.length === 0} className={`px-4 py-2 bg-white text-black rounded ${results.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>Print</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="salary-checkbox"
              checked={reportSelection.salary}
              onChange={(e) => setReportSelection({ ...reportSelection, salary: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="salary-checkbox" className="text-sm text-gray-400">Salary</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="diesel-checkbox"
              checked={reportSelection.diesel}
              onChange={(e) => setReportSelection({ ...reportSelection, diesel: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="diesel-checkbox" className="text-sm text-gray-400">Diesel</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="insurance-checkbox"
              checked={reportSelection.insurance}
              onChange={(e) => setReportSelection({ ...reportSelection, insurance: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="insurance-checkbox" className="text-sm text-gray-400">Insurance</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="mileage-checkbox"
              checked={reportSelection.mileage}
              onChange={(e) => setReportSelection({ ...reportSelection, mileage: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="mileage-checkbox" className="text-sm text-gray-400">Mileage</label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-lg p-5">
          <h3 className="font-medium mb-3">Summary</h3>
          <div className="text-sm text-gray-400 mb-2">Showing {results.length} records</div>
          <div className="text-sm">Total Mileage: <span className="font-medium">{total(results).toLocaleString()} KES</span></div>
          <div className="text-sm">Exchange Rate: <span className="font-medium">1 USD = {exchangeRate} KES</span></div>
          <div className="text-sm">Total in USD: <span className="font-medium">${totalUSD(results).toFixed(2)} USD</span></div>
        </div>

        <div className="bg-gray-900 rounded-lg p-5">
          <h3 className="font-medium mb-3">Details</h3>
          <div className="max-h-96 overflow-auto">
            {results.length === 0 ? (
              <div className="text-sm text-gray-400">No records. Click Generate Report.</div>
            ) : (
              <ul className="space-y-3">
                {results.map((r: any, idx: number) => (
                  <li key={r.id ?? idx} className="bg-gray-800 p-3 rounded text-sm">
                    {r.category === "Diesel" ? (
                      <>
                        <div className="text-gray-300 font-medium">⛽ Diesel - {r.type}</div>
                        <div className="mt-2 text-gray-400 space-y-1">
                          <div>📅 {formatShort(r.date)}</div>
                          <div>📊 {Number(r.litres || 0)} L</div>
                          <div className="font-medium text-green-400">💰 {Number(r.amount).toLocaleString()} KES</div>
                        </div>
                      </>
                    ) : r.category === "Insurance" ? (
                      <>
                        <div className="text-gray-300 font-medium">🛡️ Insurance - {r.type}</div>
                        <div className="mt-2 text-gray-400 space-y-1">
                          <div>📅 {formatShort(r.date)}</div>
                          {r.vehicle && <div>🚗 {r.vehicle}</div>}
                          <div className="font-medium text-green-400">💰 {Number(r.amount).toLocaleString()} KES</div>
                        </div>
                      </>
                    ) : r.category === "Mileage" ? (
                      <>
                        <div className="text-gray-300 font-medium">🗺️ Mileage</div>
                        <div className="mt-2 text-gray-400 space-y-1">
                          {r.country && <div>📍 {r.country}{r.county ? ` • ${r.county}` : ''}</div>}
                          <div>🛣️ {Number(r.mileage || 0)} km</div>
                          <div className="font-medium text-green-400">💰 {Number(r.amount).toLocaleString()} {r.currency}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-gray-300 font-medium">{r.category}</div>
                        <div className="mt-2 text-gray-400 space-y-1">
                          <div>📅 {formatShort(r.date)}</div>
                          <div className="font-medium text-green-400">💰 {Number(r.amount).toLocaleString()} KES</div>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
