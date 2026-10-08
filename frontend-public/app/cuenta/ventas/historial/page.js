"use client";

import { useStore } from "@/context/StoreContext";
import { getSalesBySeller } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import SellerOnly from "@/components/SellerOnly";

export default function SalesHistory() {
  const { user } = useStore();
  return (
    <SellerOnly>
      <List userId={user?.id} />
    </SellerOnly>
  );
}

function List({ userId }) {
  const sales = getSalesBySeller(userId);
  return (
    <div className="md-stack">
      <h2 className="md-title-large" style={{ margin: 0 }}>Historial de ventas</h2>
      <div className="md-card md-card-elevated">
        <div className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>
                <th>Venta</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Payout</th>
                <th style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.id}</td>
                  <td>{s.buyerName}</td>
                  <td>{formatDate(s.date)}</td>
                  <td style={{ textTransform: "capitalize" }}>{s.status}</td>
                  <td style={{ textTransform: "capitalize" }}>{s.payout}</td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>{formatCurrency(s.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
