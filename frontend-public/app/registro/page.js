import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export const metadata = { title: "Registro · Movistar" };

export default function RegisterPage() {
  return (
    <div className="md-container md-page">
      <Suspense fallback={<div>Cargando…</div>}>
        <RegisterClient />
      </Suspense>
    </div>
  );
}
