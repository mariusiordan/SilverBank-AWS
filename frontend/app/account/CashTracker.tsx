"use client";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const CATEGORIES = ["🍔 Food", "🚌 Transport", "🛍️ Shopping", "💊 Health", "🎉 Entertainment", "📦 Other"];

export default function CashTracker({ userId }: { userId: number }) {
  void userId;

  const [entries, setEntries] = useState<any[]>([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  async function load() {
    const res = await fetch(`${API_URL}/api/cash`, { credentials: "include" });
    if (res.ok) setEntries(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/cash`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: desc, amount: Number(amount), category }),
    });
    if (res.ok) { setDesc(""); setAmount(""); load(); }
  }

  async function handleDelete(id: number) {
    await fetch(`${API_URL}/api/cash`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  const total = entries.reduce((sum, e) => sum + e.amount, 0);

  return (
    <section style={{ maxWidth: 900, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1.5rem", color: "#222" }}>💵 Cash Tracker</h3>
      <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 140px 180px 100px", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <input style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #ddd", fontSize: "0.95rem" }} placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} required />
        <input style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #ddd", fontSize: "0.95rem" }} type="number" placeholder="Amount (£)" value={amount} onChange={e => setAmount(e.target.value)} required />
        <select style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #ddd", fontSize: "0.95rem", background: "#fff" }} value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button type="submit" style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "none", background: "#2ecc71", color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>+ Add</button>
      </form>
      {entries.length === 0 ? (
        <p style={{ color: "#aaa", textAlign: "center", padding: "2rem 0" }}>No cash entries yet.</p>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 1rem", marginBottom: "0.75rem", background: "#f8f9fa", borderRadius: 8, fontWeight: 600, color: "#333" }}>
            <span>Total spent</span>
            <span style={{ color: "#e74c3c" }}>-£{total.toLocaleString()}</span>
          </div>
          {entries.map(e => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", borderRadius: 10, marginBottom: "0.5rem", background: "#f8f9fa", borderLeft: "4px solid #2ecc71" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ background: "#e8f8f0", color: "#27ae60", borderRadius: 6, padding: "0.2rem 0.6rem", fontSize: "0.8rem", fontWeight: 600 }}>{e.category}</span>
                <span style={{ color: "#333", fontWeight: 500 }}>{e.description}</span>
                <span style={{ color: "#aaa", fontSize: "0.8rem" }}>{new Date(e.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontWeight: 700, color: "#e74c3c" }}>-£{e.amount}</span>
                <button onClick={() => handleDelete(e.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", color: "#e74c3c" }}>🗑️</button>
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
