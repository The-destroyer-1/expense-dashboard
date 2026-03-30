// ...existing code...
import { useState, useMemo, useEffect, type FormEvent } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

function MileageEntryItem({ entry, onRemove }: { entry: any; onRemove: () => void }) {
  const { updateMileage } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [editCountry, setEditCountry] = useState(entry.country || "");
  const [editCounty, setEditCounty] = useState(entry.county || "");
  const [editCompany, setEditCompany] = useState(entry.company || "");

  function formatShortDate(d?: string) {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
  }

  const handleSave = () => {
    updateMileage(entry.id, {
      country: editCountry || undefined,
      county: editCounty || undefined,
      company: editCompany || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditCountry(entry.country || "");
    setEditCounty(entry.county || "");
    setEditCompany(entry.company || "");
    setIsEditing(false);
  };

  return (
    <li className="grid grid-cols-3 items-center gap-4 bg-gray-800 p-3 rounded">
      <div className="text-sm text-gray-300">
        {formatShortDate(entry.date)} •{" "}
        {isEditing ? (
          <div className="flex flex-col gap-1 mt-1">
            <input
              placeholder="Country"
              value={editCountry}
              onChange={(e) => setEditCountry(e.target.value)}
              className="bg-gray-700 p-1 rounded text-xs"
              list="countries-list-edit"
            />
            <input
              placeholder="County"
              value={editCounty}
              onChange={(e) => setEditCounty(e.target.value)}
              className="bg-gray-700 p-1 rounded text-xs"
              list="counties-list-edit"
            />
            <select
              value={editCompany}
              onChange={(e) => setEditCompany(e.target.value)}
              className="bg-gray-700 p-1 rounded text-xs"
            >
              <option value="">Select Company</option>
              <option value="herocean">Herocean</option>
              <option value="greatlakes">Great Lakes</option>
              <option value="samad">Samad</option>
              <option value="sealinka">Sealinka</option>
            </select>
            <select
              value={entry.type || 'out'}
              onChange={(e) => updateMileage(entry.id, { type: e.target.value as 'in' | 'out' })}
              className="bg-gray-700 p-1 rounded text-xs"
            >
              <option value="out">Mileage Out</option>
              <option value="in">Mileage In</option>
            </select>
            <datalist id="countries-list-edit">
              <option>Algeria</option>
              <option>Angola</option>
              <option>Benin</option>
              <option>Botswana</option>
              <option>Burkina Faso</option>
              <option>Burundi</option>
              <option>Cabo Verde</option>
              <option>Cameroon</option>
              <option>Central African Republic</option>
              <option>Chad</option>
              <option>Comoros</option>
              <option>Congo (Brazzaville)</option>
              <option>Congo (Kinshasa)</option>
              <option>Côte d'Ivoire</option>
              <option>Djibouti</option>
              <option>Egypt</option>
              <option>Equatorial Guinea</option>
              <option>Eritrea</option>
              <option>Eswatini</option>
              <option>Ethiopia</option>
              <option>Gabon</option>
              <option>Gambia</option>
              <option>Ghana</option>
              <option>Guinea</option>
              <option>Guinea-Bissau</option>
              <option>Kenya</option>
              <option>Lesotho</option>
              <option>Liberia</option>
              <option>Libya</option>
              <option>Madagascar</option>
              <option>Malawi</option>
              <option>Mali</option>
              <option>Mauritania</option>
              <option>Mauritius</option>
              <option>Morocco</option>
              <option>Mozambique</option>
              <option>Namibia</option>
              <option>Niger</option>
              <option>Nigeria</option>
              <option>Rwanda</option>
              <option>Sao Tome and Principe</option>
              <option>Senegal</option>
              <option>Seychelles</option>
              <option>Sierra Leone</option>
              <option>Somalia</option>
              <option>South Africa</option>
              <option>South Sudan</option>
              <option>Sudan</option>
              <option>Tanzania</option>
              <option>Togo</option>
              <option>Tunisia</option>
              <option>Uganda</option>
              <option>Zambia</option>
              <option>Zimbabwe</option>
            </datalist>
            <datalist id="counties-list-edit">
              <option value="Nairobi" />
              <option value="Mombasa" />
              <option value="Kisumu" />
              <option value="Nakuru" />
              <option value="Uasin Gishu" />
              <option value="Kiambu" />
              <option value="Machakos" />
              <option value="Kajiado" />
              <option value="Meru" />
              <option value="Embu" />
            </datalist>
          </div>
        ) : (
          <>
            {entry.country ? `${entry.country}${entry.county ? ' • ' + entry.county : ''}` : (entry.route || "-")}
            {entry.company ? ` • ${entry.company}` : ''}
          </>
        )}
      </div>
      <div className="font-medium">{Number(entry.amount).toLocaleString()} {entry.currency}</div>
      <div className="text-right flex gap-1">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-green-400">
              <Check size={14} />
            </button>
            <button onClick={handleCancel} className="text-red-400">
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="text-blue-400">
              <Edit2 size={14} />
            </button>
            <button onClick={onRemove} className="text-red-400">
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export function FundsTab() {
  const {
    salary,
    addSalary,
    removeSalary,
    diesel,
    addDiesel,
    removeDiesel,
    insurance,
    addInsurance,
    removeInsurance,
    mileage,
    addMileage,
    removeMileage,
    reportSelection,
    setReportSelection,
  } = useDashboard();

  const [selectedCategory, setSelectedCategory] = useState("Salary");

  const [salaryForm, setSalaryForm] = useState({ date: "", amount: "" });
  const [dieselForm, setDieselForm] = useState({ date: "", amount: "", litres: "", vehicle: "" });
  const [dieselFormType, setDieselFormType] = useState("Diesel");
  const [insuranceForm, setInsuranceForm] = useState({ date: "", amount: "", price: "", type: "", vehicle: "" });
  type MileageForm = {
    date: string;
    country: string;
    county: string;
    mileage: string;
    amount: string;
    currency: 'KES' | 'USD';
    company: string;
    type: 'in' | 'out';
  };

  const [mileageForm, setMileageForm] = useState<MileageForm>({ date: "", country: "", county: "", mileage: "", amount: "", currency: "KES", company: "", type: "out" });
  const [mileageAmountManual, setMileageAmountManual] = useState(false);

  // Load last-used country/county from localStorage to auto-populate fields
  useEffect(() => {
    try {
      const lastCountry = localStorage.getItem("last_mileage_country");
      const lastCounty = localStorage.getItem("last_mileage_county");
      if (lastCountry || lastCounty) {
        setMileageForm((s) => ({ ...s, country: lastCountry || "", county: lastCounty || "" }));
      }
    } catch (e) {}
  }, []);

  const totalSalary = useMemo(
    () => (salary?.reduce((acc, s) => acc + Number(s.amount || 0), 0) ?? 0),
    [salary]
  );
  const totalDiesel = useMemo(
    () => (diesel?.reduce((acc, d) => acc + Number(d.amount || 0), 0) ?? 0),
    [diesel]
  );
  const totalInsurance = useMemo(
    () => (insurance?.reduce((acc, i) => acc + Number(i.amount || 0), 0) ?? 0),
    [insurance]
  );
  const totalMileageKES = useMemo(
    () => (mileage?.filter(m => m.currency === 'KES').reduce((acc, m) => acc + Number(m.amount || 0), 0) ?? 0),
    [mileage]
  );

  const totalMileageUSD = useMemo(
    () => (mileage?.filter(m => m.currency === 'USD').reduce((acc, m) => acc + Number(m.amount || 0), 0) ?? 0),
    [mileage]
  );

  function formatShortDate(d?: string) {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
  }

  const handleSalarySubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!salaryForm.date || !salaryForm.amount) return;
    addSalary({ date: salaryForm.date, amount: Number(salaryForm.amount) });
    setSalaryForm({ date: "", amount: "" });
  };


  const handleDieselSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!dieselForm.date || !dieselForm.amount || !dieselForm.litres) return;
    addDiesel({
      date: dieselForm.date,
      amount: Number(dieselForm.amount),
      litres: Number(dieselForm.litres),
      type: dieselFormType,
      vehicle: dieselForm.vehicle,
    });
    setDieselForm({ date: "", amount: "", litres: "", vehicle: "" });
    setDieselFormType("Diesel");
  };

  const handleInsuranceSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!insuranceForm.date || !insuranceForm.amount) return;
    addInsurance({
      date: insuranceForm.date,
      amount: Number(insuranceForm.amount),
      price: insuranceForm.price ? Number(insuranceForm.price) : undefined,
      type: insuranceForm.type || "",
      vehicle: insuranceForm.vehicle || "",
    });
    setInsuranceForm({ date: "", amount: "", price: "", type: "", vehicle: "" });
  };

  const handleMileageSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!mileageForm.date || !mileageForm.amount) return;
    addMileage({
      date: mileageForm.date,
      route: mileageForm.county || mileageForm.country || "",
      mileage: mileageForm.mileage ? Number(mileageForm.mileage) : undefined,
      amount: Number(mileageForm.amount),
      currency: mileageForm.currency as 'KES' | 'USD',
      country: mileageForm.country || undefined,
      county: mileageForm.county || undefined,
      company: mileageForm.company || undefined,
      type: mileageForm.type,
    });
    try {
      // remember last used country/county for next time
      if (mileageForm.country) localStorage.setItem("last_mileage_country", mileageForm.country);
      if (mileageForm.county) localStorage.setItem("last_mileage_county", mileageForm.county);
    } catch (e) {}
    setMileageAmountManual(false);
    setMileageForm({ date: "", country: "", county: "", mileage: "", amount: "", currency: "KES", company: "", type: "out" });
  };

  return (
    <div className="w-full px-6 py-8 mx-auto max-w-6xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-semibold">Funds</h1>
        <p className="text-sm text-gray-400 mt-1">Manage salary, diesel, insurance and mileage entries</p>
      </header>

      {/* Category Navbar */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory("Salary")}
            className={`px-4 py-2 rounded ${selectedCategory === "Salary" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Salary
          </button>
          <button
            onClick={() => setSelectedCategory("Diesel")}
            className={`px-4 py-2 rounded ${selectedCategory === "Diesel" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Diesel
          </button>
          <button
            onClick={() => setSelectedCategory("Insurance")}
            className={`px-4 py-2 rounded ${selectedCategory === "Insurance" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Insurance
          </button>
          <button
            onClick={() => setSelectedCategory("Mileage")}
            className={`px-4 py-2 rounded ${selectedCategory === "Mileage" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            Mileage
          </button>
        </div>
      </div>

      {/* Report Selection */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-300 mb-3 font-medium">Include in Reports:</p>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={reportSelection.salary} onChange={(e) => setReportSelection({ ...reportSelection, salary: e.target.checked })} className="rounded" />
            <span className="text-sm">Salary</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={reportSelection.diesel} onChange={(e) => setReportSelection({ ...reportSelection, diesel: e.target.checked })} className="rounded" />
            <span className="text-sm">Diesel</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={reportSelection.insurance} onChange={(e) => setReportSelection({ ...reportSelection, insurance: e.target.checked })} className="rounded" />
            <span className="text-sm">Insurance</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={reportSelection.mileage} onChange={(e) => setReportSelection({ ...reportSelection, mileage: e.target.checked })} className="rounded" />
            <span className="text-sm">Mileage</span>
          </label>
        </div>
      </div>

      {/* Totals */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 rounded-lg p-4 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Total Salary</div>
          <div className="text-2xl font-bold mt-2">{totalSalary.toLocaleString()} KES</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Total Diesel</div>
          <div className="text-2xl font-bold mt-2">{totalDiesel.toLocaleString()} KES</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Total Insurance</div>
          <div className="text-2xl font-bold mt-2">{totalInsurance.toLocaleString()} KES</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Total Mileage</div>
          <div className="text-2xl font-bold mt-2">{totalMileageKES.toLocaleString()} KES</div>
          <div className="text-lg font-semibold mt-1 text-green-400">${totalMileageUSD.toLocaleString()} USD</div>
        </div>
      </section>

      {/* Main content: forms (left) and entries (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forms column */}
        <aside className="space-y-6">
          {selectedCategory === "Salary" && (
            <div className="bg-gray-900 rounded-lg p-5">
              <h2 className="font-medium mb-3">Add Salary</h2>
              <form onSubmit={handleSalarySubmit} className="flex flex-col gap-2">
                <input type="date" value={salaryForm.date} onChange={(e) => setSalaryForm((s) => ({ ...s, date: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />
                <input placeholder="Amount (KES)" value={salaryForm.amount} onChange={(e) => setSalaryForm((s) => ({ ...s, amount: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />
                <button type="submit" className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 rounded">
                  <Plus size={14} /> Add Salary
                </button>
              </form>
            </div>
          )}

          {selectedCategory === "Diesel" && (
            <div className="bg-gray-900 rounded-lg p-5">
              <h2 className="font-medium mb-3">Add Diesel</h2>
              <form onSubmit={handleDieselSubmit} className="flex flex-col gap-2">
                <input type="date" value={dieselForm.date} onChange={(e) => setDieselForm((s) => ({ ...s, date: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />
                <select value={dieselFormType} onChange={(e) => setDieselFormType(e.target.value)} className="bg-gray-800 p-2 rounded text-center">
                  <option value="Diesel">Diesel</option>
                  <option value="Grease">Grease</option>
                  <option value="Hydraulic Power">Hydraulic Power</option>
                </select>
                <input placeholder="Amount (KES)" value={dieselForm.amount} onChange={(e) => setDieselForm((s) => ({ ...s, amount: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />
                <input placeholder="Litres" value={dieselForm.litres} onChange={(e) => setDieselForm((s) => ({ ...s, litres: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />
                <input placeholder="Vehicle" value={dieselForm.vehicle} onChange={(e) => setDieselForm((s) => ({ ...s, vehicle: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />
                <button type="submit" className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 rounded">
                  <Plus size={14} /> Add Diesel
                </button>
              </form>
            </div>
          )}

          {selectedCategory === "Insurance" && (
            <div className="bg-gray-900 rounded-lg p-5">
              <h2 className="font-medium mb-3">Add Insurance</h2>
              <form onSubmit={handleInsuranceSubmit} className="flex flex-col gap-2">
                <input type="date" value={insuranceForm.date} onChange={(e) => setInsuranceForm((s) => ({ ...s, date: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />
                <input placeholder="Amount (KES)" value={insuranceForm.amount} onChange={(e) => setInsuranceForm((s) => ({ ...s, amount: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />
                <input placeholder="Price (optional)" value={insuranceForm.price} onChange={(e) => setInsuranceForm((s) => ({ ...s, price: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />
                <input placeholder="Type (e.g. Comprehensive)" value={insuranceForm.type} onChange={(e) => setInsuranceForm((s) => ({ ...s, type: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />
                <input placeholder="Vehicle (optional)" value={insuranceForm.vehicle} onChange={(e) => setInsuranceForm((s) => ({ ...s, vehicle: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />
                <button type="submit" className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-orange-600 rounded">
                  <Plus size={14} /> Add Insurance
                </button>
              </form>
            </div>
          )}

          {selectedCategory === "Mileage" && (
            <div className="bg-gray-900 rounded-lg p-5">
              <h2 className="font-medium mb-3">Add Mileage (KES)</h2>
              <form onSubmit={handleMileageSubmit} className="flex flex-col gap-2">
                <input type="date" value={mileageForm.date} onChange={(e) => setMileageForm((s) => ({ ...s, date: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />

                <input list="countries-list" placeholder="Country (searchable)" value={mileageForm.country} onChange={(e) => {
                  const val = e.target.value;
                  // clear county when country changes; if user has previous county saved for this country, keep it
                  let countyVal = "";
                  try {
                    const lastCounty = localStorage.getItem("last_mileage_county");
                    const lastCountry = localStorage.getItem("last_mileage_country");
                    if (lastCountry === val && lastCounty) countyVal = lastCounty;
                  } catch (e) {}
                  setMileageForm((s) => ({ ...s, country: val, county: countyVal }));
                }} className="bg-gray-800 p-2 rounded text-center" />
                <datalist id="countries-list">
                  <option>Algeria</option>
                  <option>Angola</option>
                  <option>Benin</option>
                  <option>Botswana</option>
                  <option>Burkina Faso</option>
                  <option>Burundi</option>
                  <option>Cabo Verde</option>
                  <option>Cameroon</option>
                  <option>Central African Republic</option>
                  <option>Chad</option>
                  <option>Comoros</option>
                  <option>Congo (Brazzaville)</option>
                  <option>Congo (Kinshasa)</option>
                  <option>Côte d'Ivoire</option>
                  <option>Djibouti</option>
                  <option>Egypt</option>
                  <option>Equatorial Guinea</option>
                  <option>Eritrea</option>
                  <option>Eswatini</option>
                  <option>Ethiopia</option>
                  <option>Gabon</option>
                  <option>Gambia</option>
                  <option>Ghana</option>
                  <option>Guinea</option>
                  <option>Guinea-Bissau</option>
                  <option>Kenya</option>
                  <option>Lesotho</option>
                  <option>Liberia</option>
                  <option>Libya</option>
                  <option>Madagascar</option>
                  <option>Malawi</option>
                  <option>Mali</option>
                  <option>Mauritania</option>
                  <option>Mauritius</option>
                  <option>Morocco</option>
                  <option>Mozambique</option>
                  <option>Namibia</option>
                  <option>Niger</option>
                  <option>Nigeria</option>
                  <option>Rwanda</option>
                  <option>Sao Tome and Principe</option>
                  <option>Senegal</option>
                  <option>Seychelles</option>
                  <option>Sierra Leone</option>
                  <option>Somalia</option>
                  <option>South Africa</option>
                  <option>South Sudan</option>
                  <option>Sudan</option>
                  <option>Tanzania</option>
                  <option>Togo</option>
                  <option>Tunisia</option>
                  <option>Uganda</option>
                  <option>Zambia</option>
                  <option>Zimbabwe</option>
                </datalist>

                <input placeholder="County / Region (optional)" list="counties-list" value={mileageForm.county} onChange={(e) => setMileageForm((s) => ({ ...s, county: e.target.value }))} className="bg-gray-800 p-2 rounded text-center" />
                <datalist id="counties-list">
                  <option value="Nairobi" />
                  <option value="Mombasa" />
                  <option value="Kisumu" />
                  <option value="Nakuru" />
                  <option value="Uasin Gishu" />
                  <option value="Kiambu" />
                  <option value="Machakos" />
                  <option value="Kajiado" />
                  <option value="Meru" />
                  <option value="Embu" />
                </datalist>

                <input placeholder="Mileage (km)" value={mileageForm.mileage} onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, "");
                  // auto-calculate amount if user hasn't edited it manually
                  if (!mileageAmountManual && val) {
                    const perKm = 15; // default rate KES per km
                    const calc = Math.round(Number(val) * perKm);
                    setMileageForm((s) => ({ ...s, mileage: val, amount: String(calc) }));
                  } else {
                    setMileageForm((s) => ({ ...s, mileage: val }));
                  }
                }} className="bg-gray-800 p-2 rounded text-center" />
                <select value={mileageForm.currency} onChange={(e) => setMileageForm((s) => ({ ...s, currency: e.target.value as 'KES' | 'USD' }))} className="bg-gray-800 p-2 rounded text-center">
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                </select>
                <select value={mileageForm.company} onChange={(e) => setMileageForm((s) => ({ ...s, company: e.target.value }))} className="bg-gray-800 p-2 rounded text-center">
                  <option value="">Select Company</option>
                  <option value="herocean">Herocean</option>
                  <option value="greatlakes">Great Lakes</option>
                  <option value="samad">Samad</option>
                  <option value="sealinka">Sealinka</option>
                </select>
                <select value={mileageForm.type} onChange={(e) => setMileageForm((s) => ({ ...s, type: e.target.value as 'in' | 'out' }))} className="bg-gray-800 p-2 rounded text-center">
                  <option value="out">Mileage Out</option>
                  <option value="in">Mileage In</option>
                </select>
                <input placeholder={`Amount (${mileageForm.currency})`} value={mileageForm.amount} onChange={(e) => { setMileageAmountManual(true); setMileageForm((s) => ({ ...s, amount: e.target.value })); }} className="bg-gray-800 p-2 rounded text-center" />
                <button type="submit" className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 rounded">
                  <Plus size={14} /> Add Mileage
                </button>
              </form>
            </div>
          )}
        </aside>

        {/* Entries column */}
        <main className="space-y-6">
          {selectedCategory === "Salary" && (
            <section className="bg-gray-900 rounded-lg p-5">
              <h3 className="font-medium mb-3">Salary Entries</h3>
              <div className="w-full overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 px-2 mb-2">
                    <div>Date</div>
                    <div>Amount</div>
                    <div className="text-right">Action</div>
                  </div>
                  <ul className="space-y-2">
                    {salary?.map((s: any, i: number) => (
                      <li key={s.id ?? i} className="grid grid-cols-3 items-center gap-4 bg-gray-800 p-3 rounded">
                        <div className="text-sm text-gray-300">{formatShortDate(s.date)}</div>
                        <div className="font-medium">{Number(s.amount).toLocaleString()} KES</div>
                        <div className="text-right">
                          <button onClick={() => removeSalary(s.id ?? i)} className="text-red-400 inline-flex items-center gap-2">
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {selectedCategory === "Diesel" && (
            <section className="bg-gray-900 rounded-lg p-5">
              <h3 className="font-medium mb-3">Diesel Entries</h3>
              <div className="w-full overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-5 gap-4 text-sm text-gray-400 px-2 mb-2">
                    <div>Date</div>
                    <div>Type</div>
                    <div>Litres</div>
                    <div>Amount</div>
                    <div className="text-right">Action</div>
                  </div>
                  <ul className="space-y-2">
                    {diesel?.map((d: any, i: number) => (
                      <li key={d.id ?? i} className="grid grid-cols-5 items-center gap-4 bg-gray-800 p-3 rounded">
                        <div className="text-sm text-gray-300">{formatShortDate(d.date)}</div>
                        <div className="">{d.type || "-"}</div>
                        <div className="">{Number(d.litres || 0)} L</div>
                        <div className="font-medium">{Number(d.amount).toLocaleString()} KES</div>
                        <div className="text-right">
                          <button onClick={() => removeDiesel(d.id ?? i)} className="text-red-400 inline-flex items-center gap-2">
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {selectedCategory === "Insurance" && (
            <section className="bg-gray-900 rounded-lg p-5">
              <h3 className="font-medium mb-3">Insurance Entries</h3>
              <div className="w-full overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-4 gap-4 text-sm text-gray-400 px-2 mb-2">
                    <div>Date</div>
                    <div>Type</div>
                    <div>Vehicle</div>
                    <div className="text-right">Amount</div>
                  </div>
                  <ul className="space-y-2">
                    {insurance?.map((ins: any, i: number) => (
                      <li key={ins.id ?? i} className="grid grid-cols-4 items-center gap-4 bg-gray-800 p-3 rounded">
                        <div className="text-sm text-gray-300">{formatShortDate(ins.date)}</div>
                        <div className="">{ins.type || "-"}</div>
                        <div className="">{ins.vehicle || "-"}</div>
                        <div className="text-right font-medium">{Number(ins.amount).toLocaleString()} KES</div>
                        <div className="col-span-4 text-right mt-2">
                          <button onClick={() => removeInsurance(ins.id ?? i)} className="text-red-400 inline-flex items-center gap-2">
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {selectedCategory === "Mileage" && (
            <section className="bg-gray-900 rounded-lg p-5">
              <h3 className="font-medium mb-3">Mileage Entries</h3>
              <div className="w-full overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 px-2 mb-2">
                    <div>Date • Route</div>
                    <div>Amount (KES)</div>
                    <div className="text-right">Action</div>
                  </div>
                  <ul className="space-y-2">
                    {mileage?.map((m: any, i: number) => (
                      <MileageEntryItem key={m.id ?? i} entry={m} onRemove={() => removeMileage(m.id ?? i)} />
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
// ...existing code...