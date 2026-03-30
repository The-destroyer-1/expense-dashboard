import { useMemo } from "react";

export default function TyresResultTab(){
  const tyres = useMemo(()=>{
    try{
      const raw = localStorage.getItem('tyres_state');
      return raw ? JSON.parse(raw) : [];
    }catch{ return []; }
  }, []);

  const grouped = useMemo(()=>{
    const m: Record<string, { company: string; type: string; totalAmount: number; count: number }>= {};
    tyres.forEach((t: any)=>{
      const key = `${t.type}||${t.company}`;
      if(!m[key]) m[key] = { company: t.company, type: t.type, totalAmount: 0, count: 0 };
      m[key].totalAmount += t.amount;
      m[key].count += 1;
    });
    return Object.values(m);
  }, [tyres]);

  const totalValue = grouped.reduce((s, g) => s + g.totalAmount, 0);
  const totalCount = grouped.reduce((s, g) => s + g.count, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-white text-xl font-bold">Tyres Summary</h3>
            <p className="text-gray-400">Types / Company aggregated</p>
          </div>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Print Report
          </button>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {grouped.map((g, idx)=> (
              <div key={idx} className="bg-gray-800 p-3 rounded">
                <div className="text-white font-semibold">{g.type}</div>
                <div className="text-gray-400 text-sm">{g.company}</div>
                <div className="mt-2 text-yellow-300 font-bold">KES {g.totalAmount.toLocaleString()}</div>
                <div className="text-gray-300 text-sm">Count: {g.count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 text-white font-semibold">Total Value: KES {totalValue.toLocaleString()} — Total Entries: {totalCount}</div>
      </div>
    </div>
  );
}
