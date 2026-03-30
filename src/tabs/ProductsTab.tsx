import { useState, useMemo, useEffect } from "react";
import { useDashboard } from "../context/DashboardContext";
import { Trash2, Search } from "lucide-react";

export function ProductsTab() {
  const { products, removeProduct } = useDashboard();
  const [selectedCategory, setSelectedCategory] = useState("Products");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.date.includes(searchTerm) ||
        product.spareParts.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.truckNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="w-full space-y-8 bg-gray-950 text-gray-100">
      {/* Category Navbar */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory("Products")}
            className={`px-4 py-2 rounded ${selectedCategory === "Products" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Products
          </button>
          <button
            onClick={() => setSelectedCategory("Tyres")}
            className={`px-4 py-2 rounded ${selectedCategory === "Tyres" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Tyres
          </button>
          <button
            onClick={() => setSelectedCategory("Tyre Repair")}
            className={`px-4 py-2 rounded ${selectedCategory === "Tyre Repair" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Tyre Repair Card
          </button>
          <button
            onClick={() => setSelectedCategory("Tyre Disposal")}
            className={`px-4 py-2 rounded ${selectedCategory === "Tyre Disposal" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Tyre Disposal
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {selectedCategory === "Products" && (
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-2xl relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
            <input
              type="text"
              placeholder="Search by date, spare parts, or truck number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      )}

      {selectedCategory === "Products" && (
        <>
          {/* Products Table */}
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800">
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold text-sm">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold text-sm">
                      Truck Number
                    </th>
                    <th className="px-6 py-3 text-left text-gray-300 font-semibold text-sm">
                      Spare Parts
                    </th>
                    <th className="px-6 py-3 text-right text-gray-300 font-semibold text-sm">
                      Price
                    </th>
                    <th className="px-6 py-3 text-center text-gray-300 font-semibold text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center">
                        <p className="text-gray-400">
                          {products.length === 0
                            ? "No products added yet"
                            : "No products match your search"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-800 hover:bg-gray-800 transition"
                      >
                        <td className="px-6 py-4 text-white text-sm text-center">{product.date}</td>
                        <td className="px-6 py-4 text-white text-sm font-medium text-center">
                          {product.truckNumber}
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm text-center">
                          {product.spareParts}
                        </td>
                        <td className="px-6 py-4 text-center text-white text-sm font-semibold">
                          KES {product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="p-2 text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          {filteredProducts.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">
                  Total ({filteredProducts.length} items):
                </span>
                <span className="text-white text-2xl font-bold">
                  KES {filteredProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {selectedCategory === "Tyres" && (
        <div className="bg-gray-900 rounded-xl p-6">
          <div>
            <h3 className="text-white font-semibold mb-1">Tyres</h3>
            <p className="text-gray-400 text-sm mb-4">Retread Card</p>
          </div>
          <TyreSection />
        </div>
      )}

      {selectedCategory === "Tyre Repair" && (
        <div className="bg-gray-900 rounded-xl p-6">
          <div>
            <h3 className="text-white font-semibold mb-1">Tyre Repair Card</h3>
            <p className="text-gray-400 text-sm mb-4">Repair and maintenance tracking</p>
          </div>
          <TyreRepairSection />
        </div>
      )}

      {selectedCategory === "Tyre Disposal" && (
        <div className="bg-gray-900 rounded-xl p-6">
          <div>
            <h3 className="text-white font-semibold mb-1">Tyre Disposal</h3>
            <p className="text-gray-400 text-sm mb-4">Track disposed tyres</p>
          </div>
          <TyreDisposalSection />
        </div>
      )}
    </div>
  );
}
function TyreSection(){
  const [tyres, setTyres] = useState<any[]>(() => {
    try{ const raw = localStorage.getItem('tyres_state'); return raw ? JSON.parse(raw) : []; }catch{ return []; }
  });
  const [type, setType] = useState('');
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [dateOut, setDateOut] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [size, setSize] = useState('');
  const [codeNo, setCodeNo] = useState('');
  const [tyreRecNo, setTyreRecNo] = useState('');
  const [dateIn, setDateIn] = useState('');
  const [pattern, setPattern] = useState('');
  const [dateFitted, setDateFitted] = useState('');

  useEffect(()=>{ try{ localStorage.setItem('tyres_state', JSON.stringify(tyres)); }catch{} }, [tyres]);

  function addTyre(){
    if(!dateOut || !vehicleNumber || !size || !codeNo || !company || !tyreRecNo) { alert('Fill all required fields'); return; }
    const t = { 
      id: Date.now().toString(), 
      dateOut, 
      vehicleNumber, 
      size, 
      codeNo, 
      company, 
      tyreRecNo, 
      dateIn, 
      pattern, 
      dateFitted,
      type,
      amount: Number(amount)
    };
    setTyres(prev => [t, ...prev]);
    setDateOut(''); setVehicleNumber(''); setSize(''); setCodeNo(''); setCompany(''); setTyreRecNo(''); setDateIn(''); setPattern(''); setDateFitted(''); setType(''); setAmount(0);
  }

  function removeTyre(id: string){ setTyres(prev => prev.filter(p=>p.id !== id)); }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <div>
          <label className="text-gray-400 text-xs block mb-1">Date Out</label>
          <input value={dateOut} onChange={e=>setDateOut(e.target.value)} type="date" className="w-full px-3 py-2 bg-gray-800 rounded text-white text-sm" />
        </div>
        <input value={vehicleNumber} onChange={e=>setVehicleNumber(e.target.value.toUpperCase())} placeholder="Truck No." className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
        <input value={size} onChange={e=>setSize(e.target.value)} placeholder="Size" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
        <input value={codeNo} onChange={e=>setCodeNo(e.target.value)} placeholder="Code No." className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
        <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Make" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <input value={tyreRecNo} onChange={e=>setTyreRecNo(e.target.value)} placeholder="Tyre Rec.No" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
        <div>
          <label className="text-gray-400 text-xs block mb-1">Date In</label>
          <input value={dateIn} onChange={e=>setDateIn(e.target.value)} type="date" className="w-full px-3 py-2 bg-gray-800 rounded text-white text-sm" />
        </div>
        <input value={pattern} onChange={e=>setPattern(e.target.value)} placeholder="Pattern" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
        <div>
          <label className="text-gray-400 text-xs block mb-1">Date Fitted</label>
          <input value={dateFitted} onChange={e=>setDateFitted(e.target.value)} type="date" className="w-full px-3 py-2 bg-gray-800 rounded text-white text-sm" />
        </div>
        <input value={type} onChange={e=>setType(e.target.value)} placeholder="Tyre Type" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
      </div>
      <div className="flex gap-2">
        <button onClick={addTyre} className="bg-green-600 px-4 py-2 rounded text-white">Add Tyre</button>
        <a href="#/tyres" className="text-sm text-blue-400 underline self-center">View Tyres Results Tab</a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-gray-300">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800">
              <th className="px-2 py-2 text-left">Date Out</th>
              <th className="px-2 py-2 text-left">Truck No</th>
              <th className="px-2 py-2 text-left">Size</th>
              <th className="px-2 py-2 text-left">Code No</th>
              <th className="px-2 py-2 text-left">Make</th>
              <th className="px-2 py-2 text-left">Tyre Rec.No</th>
              <th className="px-2 py-2 text-left">Date In</th>
              <th className="px-2 py-2 text-left">Pattern</th>
              <th className="px-2 py-2 text-left">Date Fitted</th>
              <th className="px-2 py-2 text-left">Truck Fitted</th>
              <th className="px-2 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tyres.map(t => (
              <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="px-2 py-2">{t.dateOut}</td>
                <td className="px-2 py-2">{t.vehicleNumber}</td>
                <td className="px-2 py-2">{t.size}</td>
                <td className="px-2 py-2">{t.codeNo}</td>
                <td className="px-2 py-2">{t.company}</td>
                <td className="px-2 py-2">{t.tyreRecNo}</td>
                <td className="px-2 py-2">{t.dateIn}</td>
                <td className="px-2 py-2">{t.pattern}</td>
                <td className="px-2 py-2">{t.dateFitted}</td>
                <td className="px-2 py-2">{t.vehicleNumber}</td>
                <td className="px-2 py-2 text-center"><button onClick={()=>removeTyre(t.id)} className="text-red-400 px-2 py-1 bg-red-900 rounded">Delete</button></td>
              </tr>
            ))}
            {tyres.length === 0 && (
              <tr><td colSpan={11} className="px-3 py-6 text-center text-gray-500">No tyre entries yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TyreRepairSection(){
  const [repairs, setRepairs] = useState<any[]>(() => {
    try{ const raw = localStorage.getItem('tyre_repairs_state'); return raw ? JSON.parse(raw) : []; }catch{ return []; }
  });
  const [dateOut, setDateOut] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [size, setSize] = useState('');
  const [codeNo, setCodeNo] = useState('');
  const [company, setCompany] = useState('');
  const [tyreRecNo, setTyreRecNo] = useState('');
  const [newRTD, setNewRTD] = useState('');
  const [balMM, setBalMM] = useState('');
  const [dateIn, setDateIn] = useState('');
  const [invNo, setInvNo] = useState('');
  const [pattern, setPattern] = useState('');
  const [dateFitted, setDateFitted] = useState('');
  const [truckFitted, setTruckFitted] = useState('');

  useEffect(()=>{ try{ localStorage.setItem('tyre_repairs_state', JSON.stringify(repairs)); }catch{} }, [repairs]);

  function addRepair(){
    if(!dateOut || !vehicleNumber || !size || !codeNo || !company || !tyreRecNo) { alert('Fill all required fields'); return; }
    const r = { 
      id: Date.now().toString(), 
      dateOut, 
      vehicleNumber, 
      size, 
      codeNo, 
      company, 
      tyreRecNo, 
      newRTD,
      balMM,
      dateIn, 
      invNo,
      pattern, 
      dateFitted,
      truckFitted
    };
    setRepairs(prev => [r, ...prev]);
    setDateOut(''); setVehicleNumber(''); setSize(''); setCodeNo(''); setCompany(''); setTyreRecNo(''); setNewRTD(''); setBalMM(''); setDateIn(''); setInvNo(''); setPattern(''); setDateFitted(''); setTruckFitted('');
  }

  function removeRepair(id: string){ setRepairs(prev => prev.filter(p=>p.id !== id)); }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div>
          <label className="text-gray-400 text-xs block mb-1">Date Out</label>
          <input value={dateOut} onChange={e=>setDateOut(e.target.value)} type="date" className="w-full px-3 py-2 bg-gray-800 rounded text-white text-sm" />
        </div>
        <input value={vehicleNumber} onChange={e=>setVehicleNumber(e.target.value.toUpperCase())} placeholder="Truck No." className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
        <input value={size} onChange={e=>setSize(e.target.value)} placeholder="Size" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
        <input value={codeNo} onChange={e=>setCodeNo(e.target.value)} placeholder="Code No." className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Make" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
        <input value={tyreRecNo} onChange={e=>setTyreRecNo(e.target.value)} placeholder="Tyre Rec.No" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
        <input value={newRTD} onChange={e=>setNewRTD(e.target.value)} placeholder="New/RTD" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
        <input value={balMM} onChange={e=>setBalMM(e.target.value)} placeholder="Bal MM" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div>
          <label className="text-gray-400 text-xs block mb-1">Date In</label>
          <input value={dateIn} onChange={e=>setDateIn(e.target.value)} type="date" className="w-full px-3 py-2 bg-gray-800 rounded text-white text-sm" />
        </div>
        <input value={invNo} onChange={e=>setInvNo(e.target.value)} placeholder="Inv No. D./No" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
        <input value={pattern} onChange={e=>setPattern(e.target.value)} placeholder="Pattern" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
        <div>
          <label className="text-gray-400 text-xs block mb-1">Date Fitted</label>
          <input value={dateFitted} onChange={e=>setDateFitted(e.target.value)} type="date" className="w-full px-3 py-2 bg-gray-800 rounded text-white text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input value={truckFitted} onChange={e=>setTruckFitted(e.target.value.toUpperCase())} placeholder="Truck Fitted" className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" />
      </div>
      <div className="flex gap-2">
        <button onClick={addRepair} className="bg-purple-600 px-4 py-2 rounded text-white">Add Repair</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-gray-300">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800">
              <th className="px-2 py-2 text-left">Date Out</th>
              <th className="px-2 py-2 text-left">Truck No</th>
              <th className="px-2 py-2 text-left">Size</th>
              <th className="px-2 py-2 text-left">Code No</th>
              <th className="px-2 py-2 text-left">Make</th>
              <th className="px-2 py-2 text-left">Tyre Rec.No</th>
              <th className="px-2 py-2 text-left">New/RTD</th>
              <th className="px-2 py-2 text-left">Bal MM</th>
              <th className="px-2 py-2 text-left">Date In</th>
              <th className="px-2 py-2 text-left">Inv No. D./No</th>
              <th className="px-2 py-2 text-left">Pattern</th>
              <th className="px-2 py-2 text-left">Date Fitted</th>
              <th className="px-2 py-2 text-left">Truck Fitted</th>
              <th className="px-2 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {repairs.map(r => (
              <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="px-2 py-2">{r.dateOut}</td>
                <td className="px-2 py-2">{r.vehicleNumber}</td>
                <td className="px-2 py-2">{r.size}</td>
                <td className="px-2 py-2">{r.codeNo}</td>
                <td className="px-2 py-2">{r.company}</td>
                <td className="px-2 py-2">{r.tyreRecNo}</td>
                <td className="px-2 py-2">{r.newRTD}</td>
                <td className="px-2 py-2">{r.balMM}</td>
                <td className="px-2 py-2">{r.dateIn}</td>
                <td className="px-2 py-2">{r.invNo}</td>
                <td className="px-2 py-2">{r.pattern}</td>
                <td className="px-2 py-2">{r.dateFitted}</td>
                <td className="px-2 py-2">{r.truckFitted}</td>
                <td className="px-2 py-2 text-center"><button onClick={()=>removeRepair(r.id)} className="text-red-400 px-2 py-1 bg-red-900 rounded">Delete</button></td>
              </tr>
            ))}
            {repairs.length === 0 && (
              <tr><td colSpan={14} className="px-3 py-6 text-center text-gray-500">No repair entries yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TyreDisposalSection(){
  const [disposals, setDisposals] = useState<any[]>(() => {
    try{ const raw = localStorage.getItem('tyre_disposal_state'); return raw ? JSON.parse(raw) : []; }catch{ return []; }
  });
  const [tyres] = useState<any[]>(() => {
    try{ const raw = localStorage.getItem('tyres_state'); return raw ? JSON.parse(raw) : []; }catch{ return []; }
  });
  const [selectedTyreId, setSelectedTyreId] = useState('');
  const [disposalDate, setDisposalDate] = useState('');
  const [disposalMethod, setDisposalMethod] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(()=>{ try{ localStorage.setItem('tyre_disposal_state', JSON.stringify(disposals)); }catch{} }, [disposals]);

  function addDisposal(){
    if(!selectedTyreId || !disposalDate) { alert('Select a tyre and disposal date'); return; }
    const tyre = tyres.find(t => t.id === selectedTyreId);
    if(!tyre) { alert('Tyre not found'); return; }
    const d = {
      id: Date.now().toString(),
      tyreId: selectedTyreId,
      ...tyre,
      disposalDate,
      disposalMethod,
      notes
    };
    setDisposals(prev => [d, ...prev]);
    setSelectedTyreId('');
    setDisposalDate('');
    setDisposalMethod('');
    setNotes('');
  }

  function removeDisposal(id: string){ setDisposals(prev => prev.filter(p=>p.id !== id)); }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <select 
          value={selectedTyreId} 
          onChange={e=>setSelectedTyreId(e.target.value)} 
          className="px-3 py-2 bg-gray-800 rounded text-white text-sm"
        >
          <option value="">Select Tyre</option>
          {tyres.map(t => (
            <option key={t.id} value={t.id}>
              {t.vehicleNumber} - {t.company} {t.size}
            </option>
          ))}
        </select>
        <div>
          <label className="text-gray-400 text-xs block mb-1">Disposal Date</label>
          <input 
            value={disposalDate} 
            onChange={e=>setDisposalDate(e.target.value)} 
            type="date" 
            className="w-full px-3 py-2 bg-gray-800 rounded text-white text-sm" 
          />
        </div>
        <input 
          value={disposalMethod} 
          onChange={e=>setDisposalMethod(e.target.value)} 
          placeholder="Method (Scrap/Recycle/etc)" 
          className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" 
        />
        <input 
          value={notes} 
          onChange={e=>setNotes(e.target.value)} 
          placeholder="Notes" 
          className="px-3 py-2 bg-gray-800 rounded text-white text-sm placeholder-gray-300" 
        />
      </div>
      <button 
        onClick={addDisposal} 
        className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700 transition"
      >
        Add Disposal Record
      </button>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-gray-300">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800">
              <th className="px-3 py-2 text-left">Disposal Date</th>
              <th className="px-3 py-2 text-left">Truck No</th>
              <th className="px-3 py-2 text-left">Size</th>
              <th className="px-3 py-2 text-left">Make</th>
              <th className="px-3 py-2 text-left">Code No</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Method</th>
              <th className="px-3 py-2 text-left">Notes</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {disposals.map(d => (
              <tr key={d.id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="px-3 py-2">{d.disposalDate}</td>
                <td className="px-3 py-2">{d.vehicleNumber}</td>
                <td className="px-3 py-2">{d.size}</td>
                <td className="px-3 py-2">{d.company}</td>
                <td className="px-3 py-2">{d.codeNo}</td>
                <td className="px-3 py-2 text-yellow-300 font-semibold">KES {d.amount?.toLocaleString() || '0'}</td>
                <td className="px-3 py-2">{d.disposalMethod || '-'}</td>
                <td className="px-3 py-2 text-gray-400">{d.notes || '-'}</td>
                <td className="px-3 py-2 text-center"><button onClick={()=>removeDisposal(d.id)} className="text-red-400 px-2 py-1 bg-red-900 rounded hover:bg-red-800 transition">Delete</button></td>
              </tr>
            ))}
            {disposals.length === 0 && (
              <tr><td colSpan={9} className="px-3 py-6 text-center text-gray-500">No disposal records yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {disposals.length > 0 && (
        <div className="bg-gray-800 rounded p-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Total Disposals: {disposals.length} tyres</span>
            <span className="text-white font-bold">Total Value: KES {disposals.reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
