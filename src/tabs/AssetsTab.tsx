import { useEffect, useState } from "react";

type Asset = {
  id: string;
  category: "office" | "other";
  name: string;
  type?: string; // for other assets
  date: string;
  cost: number;
};

function loadAssets(): Asset[] {
  try {
    const raw = localStorage.getItem("assets_state");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveAssets(items: Asset[]) {
  try { localStorage.setItem("assets_state", JSON.stringify(items)); } catch {}
}

export default function AssetsTab(){
  const [assets, setAssets] = useState<Asset[]>(() => loadAssets());
  const [category, setCategory] = useState<Asset['category']>("office");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => saveAssets(assets), [assets]);

  function addAsset(){
    if(!name || !date || !cost) { alert("Please fill required fields"); return; }
    const a: Asset = { id: Date.now().toString(), category, name, type: category === 'other' ? type : undefined, date, cost };
    setAssets(prev => [a, ...prev]);
    setName(""); setType(""); setDate(""); setCost(0);
  }

  function removeAsset(id: string){ setAssets(prev => prev.filter(a => a.id !== id)); }

  const filtered = assets.filter(a => (
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.type || "").toLowerCase().includes(search.toLowerCase()) ||
    a.date.includes(search) || a.category.includes(search.toLowerCase())
  ));

  const totalCost = filtered.reduce((s, a) => s + a.cost, 0);

  return (
    <div className="w-full space-y-6">
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-white font-semibold mb-4">Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
          <div>
            <label className="text-gray-300 text-xs">Category</label>
            <select value={category} onChange={e=>setCategory(e.target.value as any)} className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700">
              <option value="office">Office Asset</option>
              <option value="other">Other Asset</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-gray-300 text-xs">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700" />
          </div>
          <div>
            <label className="text-gray-300 text-xs">Type (other only)</label>
            <input value={type} onChange={e=>setType(e.target.value)} disabled={category!=='other'} className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700" />
          </div>
          <div>
            <label className="text-gray-300 text-xs">Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700" />
          </div>
          <div>
            <label className="text-gray-300 text-xs">Cost</label>
            <input type="number" value={cost} onChange={e=>setCost(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={addAsset} className="bg-green-600 px-4 py-2 rounded text-white">Add Asset</button>
          <input placeholder="Search" value={search} onChange={e=>setSearch(e.target.value)} className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700" />
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg">
        <h4 className="text-white font-semibold mb-3">Assets List ({filtered.length})</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Name / Type</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-right">Cost</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="px-3 py-2">{a.category}</td>
                  <td className="px-3 py-2">{a.name} {a.type && <span className="text-gray-400 text-xs">/ {a.type}</span>}</td>
                  <td className="px-3 py-2">{a.date}</td>
                  <td className="px-3 py-2 text-right">KES {a.cost.toLocaleString()}</td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={()=>removeAsset(a.id)} className="text-red-400 px-2 py-1 bg-red-900 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end text-white font-semibold">Total: KES {totalCost.toLocaleString()}</div>
      </div>
    </div>
  );
}
