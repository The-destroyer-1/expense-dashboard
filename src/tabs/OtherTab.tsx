import React, { useState } from "react";
import { useDashboard } from "../context/DashboardContext";

export function OtherTab() {
  const { otherQueries, addOtherQuery, removeOtherQuery, otherExpenses, addOtherExpense, removeOtherExpense } = useDashboard();

  const [qDate, setQDate] = useState("");
  const [qName, setQName] = useState("");
  const [qDesc, setQDesc] = useState("");

  const [eName, setEName] = useState("");
  const [eDate, setEDate] = useState("");
  const [eDesc, setEDesc] = useState("");
  const [eAmount, setEAmount] = useState<number | "">("");

  function submitQuery(e: React.FormEvent) {
    e.preventDefault();
    if (!qDate || !qName) return;
    addOtherQuery({ date: qDate, name: qName, description: qDesc });
    setQDate("");
    setQName("");
    setQDesc("");
  }

  function submitExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!eDate || !eName || eAmount === "") return;
    addOtherExpense({ date: eDate, name: eName, description: eDesc, amount: Number(eAmount) });
    setEName("");
    setEDate("");
    setEDesc("");
    setEAmount("");
  }

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-xl font-semibold text-white mb-4">Other Queries</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-medium text-white mb-2">Add Query (Date / Name / Description)</h3>
          <form onSubmit={submitQuery} className="space-y-2">
            <input type="date" value={qDate} onChange={(e) => setQDate(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" />
            <input placeholder="Name" value={qName} onChange={(e) => setQName(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" />
            <textarea placeholder="Description" value={qDesc} onChange={(e) => setQDesc(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" />
            <button type="submit" className="px-4 py-2 bg-green-600 rounded text-white">Add Query</button>
          </form>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-medium text-white mb-2">Other Expense (Name / Date / Description / Amount)</h3>
          <form onSubmit={submitExpense} className="space-y-2">
            <input placeholder="Name" value={eName} onChange={(e) => setEName(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" />
            <input type="date" value={eDate} onChange={(e) => setEDate(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" />
            <textarea placeholder="Description" value={eDesc} onChange={(e) => setEDesc(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" />
            <input placeholder="Amount" type="number" value={eAmount as any} onChange={(ev) => setEAmount(ev.target.value === "" ? "" : Number(ev.target.value))} className="w-full p-2 rounded bg-gray-700 text-white" />
            <button type="submit" className="px-4 py-2 bg-green-600 rounded text-white">Add Expense</button>
          </form>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-medium text-white mb-2">Queries</h3>
          <ul className="space-y-2">
            {otherQueries.map((q) => (
              <li key={q.id} className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-300">{q.date} — <strong className="text-white">{q.name}</strong></div>
                  <div className="text-xs text-gray-400">{q.description}</div>
                </div>
                <button onClick={() => removeOtherQuery(q.id)} className="text-red-400">Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-medium text-white mb-2">Other Expenses</h3>
          <ul className="space-y-2">
            {otherExpenses.map((ex) => (
              <li key={ex.id} className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-300">{ex.date} — <strong className="text-white">{ex.name}</strong> — <span className="text-green-300">{ex.amount}</span></div>
                  <div className="text-xs text-gray-400">{ex.description}</div>
                </div>
                <button onClick={() => removeOtherExpense(ex.id)} className="text-red-400">Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
