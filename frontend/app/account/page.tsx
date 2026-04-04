"use client";

import { useEffect, useState } from "react";
import "./account.css";
import CashTracker from "./CashTracker";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface Transaction {
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface Account {
  id: number;
  iban: string;
  balance: number;
  transactions: Transaction[];
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ user: User; account: Account } | null>(null);
  const [transferIban, setTransferIban] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [closeEmail, setCloseEmail] = useState("");
  const [closePin, setClosePin] = useState("");

  async function loadAccount() {
    const res = await fetch(`${API_URL}/api/account`, {
      credentials: "include",
    });
    if (!res.ok) return;
    const d = await res.json();
    setData(d);
    setLoading(false);
  }

  useEffect(() => {
    loadAccount();
  }, []);

  if (loading) return <p>Loading account...</p>;
  if (!data) return <p>Not logged in</p>;

  const { user, account } = data;

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/transactions/transfer`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toIban: transferIban,
        amount: Number(transferAmount),
      }),
    });
    const result = await res.json();
    if (!res.ok) { alert(result.error || "Transfer failed"); return; }
    alert("Transfer successful!");
    setTransferAmount("");
    setTransferIban("");
    loadAccount();
  };

  const handleLoan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/transactions/loan`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId: account.id, amount: Number(loanAmount) }),
    });
    const result = await res.json();
    if (!res.ok) { alert(result.error || "Loan denied"); return; }
    alert("Loan approved!");
    setLoanAmount("");
    loadAccount();
  };

  const handleClose = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/auth/delete`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: closeEmail, pin: closePin }),
    });
    const result = await res.json();
    if (!res.ok) { alert(result.error || "Failed to close account"); return; }
    alert("Account deleted");
    document.cookie = "token=; Max-Age=0;";
    window.location.href = "/";
  };

  return (
    <div className="sb-page">
      <nav className="sb-nav">
        <p className="welcome">Welcome back, {user.name}!</p>
        <img src="/img/logo.png" alt="SilverBank logo" className="logo" />
        <button className="btn-logout" onClick={() => {
          document.cookie = "token=; Max-Age=0;";
          window.location.href = "/";
        }}>
          Logout
        </button>
      </nav>

      <header className="sb-header">
        <div>
          <p className="iban-label">Your IBAN</p>
          <p className="iban-value">{account.iban}</p>
        </div>
        <div className="balance-box">
          <p className="balance-label">Current Balance</p>
          <p className="balance-value">{account.balance.toLocaleString()}£</p>
        </div>
      </header>

      <main className="sb-main">
        <section className="movements">
          <h3 className="section-title">Transactions</h3>
          {account.transactions.map((t, i) => (
            <div key={i} className="movements__row">
              <div className={`movements__type movements__type--${t.type === "DEPOSIT" ? "deposit" : "withdrawal"}`}>
                {t.type}
              </div>
              <div className="movements__details">
                <p className="movements__desc">{t.description}</p>
                <p className="movements__date">{new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="movements__value">
                {(t.type === "WITHDRAW" || t.type === "TRANSFER" ? "-" : "+") + t.amount + "£"}
              </p>
            </div>
          ))}
              <div style={{
                  height: '1px',
                  background: '#eee',
                  margin: '1.5rem 0'
                    }} />
          <div className="cash-tracker-wrapper" >
            <CashTracker userId={user.id} />
          </div>
        </section>
          
        <aside className="operations">
          <div className="operation card-transfer">
            <h3>Transfer Money</h3>
            <form onSubmit={handleTransfer}>
              <input className="form__input" placeholder="Recipient IBAN" value={transferIban} onChange={(e) => setTransferIban(e.target.value)} />
              <input className="form__input" placeholder="Amount (£)" type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
              <button className="form__btn">Send</button>
            </form>
          </div>

          <div className="operation card-loan">
            <h3>Request Loan</h3>
            <form onSubmit={handleLoan}>
              <input className="form__input" placeholder="Amount (£)" type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
              <button className="form__btn">Apply</button>
            </form>
          </div>

          <div className="operation card-close">
            <h3>Close Account</h3>
            <form onSubmit={handleClose}>
              <input className="form__input" placeholder="Confirm Email" value={closeEmail} onChange={(e) => setCloseEmail(e.target.value)} />
              <input className="form__input" placeholder="PIN" type="password" value={closePin} onChange={(e) => setClosePin(e.target.value)} />
              <button className="form__btn">Close</button>
            </form>
          </div>
        </aside>
      </main>
    </div>
    
  );
}
