import { notFound } from "next/navigation";
import { ClientTurboDossierScreen } from "@/features/client-portfolio/client-turbo-dossier-screen";
import { getClientTurboDossierData } from "@/features/client-portfolio/mock-data";

type PageProps = {
  params: Promise<{ clientId: string; dossierId: string }>;
};

export default async function ClientTurboDossierPage({ params }: PageProps) {
  const { clientId, dossierId } = await params;
  if (!getClientTurboDossierData(clientId, dossierId)) {
    notFound();
  }
  return <ClientTurboDossierScreen clientId={clientId} dossierId={dossierId} />;
}
