import { useState } from "react";

export function BackupTab() {
  const [remoteUrl, setRemoteUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  function handleExport() {
    const raw = localStorage.getItem("dashboard_state");
    if (!raw) {
      alert("No data to export");
      return;
    }
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Full backup: include every localStorage key (useful for QuickBooks-like full backups)
  function handleFullExport() {
    try {
      const out: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        try {
          const val = localStorage.getItem(key);
          // try parse JSON, otherwise store raw string
          try {
            out[key] = JSON.parse(val as string);
          } catch {
            out[key] = val;
          }
        } catch (e) {
          out[key] = null;
        }
      }
      const txt = JSON.stringify({ exportedAt: Date.now(), data: out }, null, 2);
      const name = `expenses-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
      const blob = new Blob([txt], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setStatus("Full export failed: " + (e?.message || String(e)));
    }
  }

  // CSV export: flatten main transaction arrays into one CSV file for quick import into accounting tools
  function handleExportCSV() {
    try {
      const raw = localStorage.getItem("dashboard_state");
      if (!raw) {
        alert("No dashboard data to export as CSV");
        return;
      }
      const parsed = JSON.parse(raw);
      const rows: string[] = [];
      const headers = ["category","date","description","amount","extra"];
      rows.push(headers.join(","));

      const pushRow = (category: string, item: any, desc?: string, extra?: string) => {
        const date = item.date || "";
        const amount = Number(item.amount || item.price || 0) || 0;
        const description = desc || JSON.stringify(item).replace(/"/g, '""');
        rows.push([category, date, `"${description}"`, String(amount), extra ? `"${extra.replace(/"/g,'""')}"` : ""].join(","));
      };

      ;["salary","diesel","insurance","mileage","products","services","otherExpenses","otherQueries"].forEach((key) => {
        const arr = parsed[key];
        if (Array.isArray(arr)) {
          arr.forEach((it: any) => {
            const desc = key === "products" ? it.spareParts || it.truckNumber : key === "mileage" ? (it.route || it.county || it.country) : (it.type || it.name || "");
            pushRow(key, it, desc, JSON.stringify(it));
          });
        }
      });

      const csv = rows.join("\n");
      const name = `expenses-transactions-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setStatus("CSV export failed: " + (e?.message || String(e)));
    }
  }

  function handleImport(file: File | undefined) {
    if (!file) return;
    const rdr = new FileReader();
    rdr.onload = () => {
      try {
        const txt = String(rdr.result ?? "{}");
        const parsed = JSON.parse(txt);
        // improved validation: must have at least one known key
        const validKeys = [
          "diesel","salary","insurance","mileage","products","services","otherQueries","otherExpenses"
        ];
        const hasKey = validKeys.some((k) => Object.prototype.hasOwnProperty.call(parsed, k));
        if (typeof parsed !== "object" || !hasKey) throw new Error("Invalid backup format");
        localStorage.setItem("dashboard_state", txt);
        localStorage.setItem("dashboard_state_last_saved", String(Date.now()));
        setStatus("Import successful — reloading...");
        setTimeout(() => window.location.reload(), 300);
      } catch (e: any) {
        setStatus("Invalid JSON file: " + (e?.message || String(e)));
      }
    };
    rdr.readAsText(file);
  }

  async function pushToRemote() {
    const raw = localStorage.getItem("dashboard_state");
    if (!raw) {
      setStatus("No data to push");
      return;
    }
    if (!remoteUrl) {
      setStatus("Please enter a remote endpoint URL first");
      return;
    }
    try {
      setStatus("Pushing...");
      const res = await fetch(remoteUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setStatus("Push successful");
    } catch (e: any) {
      setStatus("Push failed: " + (e?.message || String(e)));
    }
  }

  const lastSaved = localStorage.getItem("dashboard_state_last_saved");
  const lastSavedText = lastSaved ? new Date(Number(lastSaved)).toLocaleString() : "Never";

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-xl font-semibold text-white mb-4">Backup & Sync</h2>

      <div className="bg-gray-800 p-4 rounded mb-4">
        <div className="text-sm text-gray-300">Last saved:</div>
        <div className="text-white font-medium mb-2">{lastSavedText}</div>

        <div className="flex gap-2">
          <button onClick={handleExport} className="px-3 py-1 rounded bg-blue-600 text-white">Export JSON (dashboard_state)</button>
          <button onClick={handleFullExport} className="px-3 py-1 rounded bg-blue-700 text-white">Full Backup (all localStorage)</button>
          <button onClick={handleExportCSV} className="px-3 py-1 rounded bg-gray-600 text-white">Export CSV (transactions)</button>

          <label className="px-3 py-1 rounded bg-yellow-600 text-black cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={(e) => handleImport(e.target.files?.[0])} />
          </label>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded">
        <div className="mb-2 text-sm text-gray-300">Remote sync (optional)</div>
        <input placeholder="https://your-endpoint.example.com/upload" value={remoteUrl} onChange={(e) => setRemoteUrl(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white mb-2" />
        <div className="flex gap-2">
          <button onClick={pushToRemote} className="px-3 py-1 rounded bg-green-600 text-white">Push Now</button>
          <button onClick={() => {
            // try to fetch from remote endpoint (GET) and import
            (async () => {
              if (!remoteUrl) { setStatus("Enter remote URL to pull from"); return; }
              try {
                setStatus("Pulling...");
                const r = await fetch(remoteUrl);
                if (!r.ok) throw new Error(`Status ${r.status}`);
                const txt = await r.text();
                JSON.parse(txt);
                localStorage.setItem("dashboard_state", txt);
                localStorage.setItem("dashboard_state_last_saved", String(Date.now()));
                setStatus("Pull successful — reloading...");
                setTimeout(() => window.location.reload(), 300);
              } catch (e: any) {
                setStatus("Pull failed: " + (e?.message || String(e)));
              }
            })();
          }} className="px-3 py-1 rounded bg-indigo-600 text-white">Pull From Remote</button>
        </div>

        {status && <div className="mt-3 text-sm text-yellow-300">{status}</div>}
      </div>
    </div>
  );
}
