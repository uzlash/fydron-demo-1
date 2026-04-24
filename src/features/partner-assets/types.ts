export type PartnerAssetDocumentStatus = "expiringSoon" | "approved" | "expired";

export type PartnerOrganisation = {
  id: string;
  name: string;
};

export type PartnerAssetDocument = {
  id: string;
  name: string;
  type: string;
  version: string;
  size: string;
  validUntilLabel: string;
  status: PartnerAssetDocumentStatus;
};
