import { MatrixDossierScreen } from "@/features/matrix/matrix-dossier-screen";

type MatrixDossierPageProps = {
  params: Promise<{ dossierId: string }>;
};

export default async function MatrixDossierPage({ params }: MatrixDossierPageProps) {
  const { dossierId } = await params;
  return <MatrixDossierScreen dossierId={dossierId} />;
}
