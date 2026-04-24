import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AuditorTurboViewScreen } from "@/features/client-portfolio/auditor-turbo-view-screen";
import { getClientTurboDossierData } from "@/features/client-portfolio/mock-data";

type PageProps = {
  params: Promise<{ clientId: string; dossierId: string }>;
};

function TurboLoading() {
  return (
    <div className="box-border h-screen w-full overflow-hidden bg-background p-2.5 text-secondary">
      <div className="flex h-full items-center justify-center rounded-lg border border-border bg-surface text-[13px]">
        Loading…
      </div>
    </div>
  );
}

export default async function AuditorTurboViewPage({ params }: PageProps) {
  const { clientId, dossierId } = await params;
  if (!getClientTurboDossierData(clientId, dossierId)) {
    notFound();
  }
  return (
    <Suspense fallback={<TurboLoading />}>
      <AuditorTurboViewScreen clientId={clientId} dossierId={dossierId} />
    </Suspense>
  );
}
