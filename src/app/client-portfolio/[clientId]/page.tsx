import { notFound } from "next/navigation";
import { ClientProfileScreen } from "@/features/client-portfolio/client-profile-screen";
import { getClientProfile } from "@/features/client-portfolio/mock-data";

type ClientProfilePageProps = {
  params: Promise<{ clientId: string }>;
};

export default async function ClientProfilePage({ params }: ClientProfilePageProps) {
  const { clientId } = await params;
  if (!getClientProfile(clientId)) {
    notFound();
  }
  return <ClientProfileScreen clientId={clientId} />;
}
