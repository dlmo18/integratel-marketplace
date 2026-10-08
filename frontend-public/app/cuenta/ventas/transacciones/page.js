"use client";

import { useStore } from "@/context/StoreContext";
import { getTransactionsBySeller } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import SellerOnly from "@/components/SellerOnly";

export default function TransactionsPage() {
  const { user } = useStore();
  return (
    <SellerOnly>
      <List userId={user?.id} />
    </SellerOnly>
  );
}

function List({ userId }) {
  const txns = getTransactionsBySeller(userId);
  const net = txns.reduce((a, t) => a + t.net, 0);

  return (
    <div className="md-stack">
      <h2 className="md-title-large" style={{ margin: 0 }}>Transacciones de pago</h2>
      <div className="md-card md-card-elevated md-card-pad-sm md-body-medium">
        Total neto acumulado:{" "}
        <span style={{ fontWeight: 700, color: "var(--md-secondary)" }}>{formatCurrency(net)}</span>
      </div>
      <div className="md-card md-card-elevated">
        <div className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Venta</th>
                <th>Fecha</th>
                <th>Método</th>
                <th style={{ textAlign: "right" }}>Monto</th>
                <th style={{ textAlign: "right" }}>Comisión</th>
                <th style={{ textAlign: "right" }}>Neto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.id}</td>
                  <td>{t.saleId}</td>
                  <td>{formatDate(t.date)}</td>
                  <td>{t.method}</td>
                  <td style={{ textAlign: "right" }}>{formatCurrency(t.amount)}</td>
                  <td style={{ textAlign: "right", color: "var(--md-error)" }}>-{formatCurrency(t.fee)}</td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>{formatCurrency(t.net)}</td>
                  <td>
                    <span className={`md-badge ${t.status === "abonado" ? "md-badge-secondary" : "md-badge-primary-container"}`} style={{ textTransform: "capitalize" }}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
