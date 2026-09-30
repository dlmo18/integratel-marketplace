import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export const metadata = { title: "Registro · Integratel" };

export default function RegisterPage() {
  return (
    <div className="container-page py-12">
      <Suspense fallback={<div>Cargando…</div>}>
        <RegisterClient />
      </Suspense>
    </div>
  );
}
