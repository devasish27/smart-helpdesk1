import { useEffect, useState } from "react";
import api from "../lib/api";

export default function ConfigPage() {
  const [form, setForm] = useState({ autoCloseEnabled: true, confidenceThreshold: 0.8, slaHours: 24 });

  useEffect(() => {
    api.get("/config").then(({ data }) => setForm(data));
  }, []);

  const save = async () => {
    await api.put("/config", form);
    alert("Settings saved!");
  };

  return (
    <div className="max-w-lg mx-auto p-4 card">
      <h2 className="text-xl font-semibold mb-4">System Configuration</h2>

      <label className="block mb-2 flex items-center space-x-2">
        <input
          type="checkbox"
          checked={form.autoCloseEnabled}
          onChange={e => setForm({ ...form, autoCloseEnabled: e.target.checked })}
        />
        <span>Auto Close Enabled</span>
      </label>

      <label className="block mb-2">
        <span className="mr-2">Confidence Threshold:</span>
        <input
          type="number"
          step="0.1"
          min="0"
          max="1"
          value={form.confidenceThreshold}
          onChange={e => setForm({ ...form, confidenceThreshold: parseFloat(e.target.value) })}
          className="input w-24"
        />
      </label>

      <label className="block mb-4">
        <span className="mr-2">SLA Hours:</span>
        <input
          type="number"
          value={form.slaHours}
          onChange={e => setForm({ ...form, slaHours: parseInt(e.target.value) })}
          className="input w-24"
        />
      </label>

      <button onClick={save} className="btn-primary w-full">Save</button>
    </div>
  );
}