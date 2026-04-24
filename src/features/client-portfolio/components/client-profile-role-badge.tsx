import type { ClientProfileRole } from "@/features/client-portfolio/types";

export function clientProfileRoleBadgeClass(role: ClientProfileRole): string {
  switch (role) {
    case "Admin":
      return "bg-surface-muted text-foreground";
    case "Auditor":
      return "bg-primary text-white";
    case "Reviewer":
      return "bg-[#1f1f1f] text-white";
    case "Contributor":
      return "bg-[#fce1e6] text-[#a4262c]";
    default:
      return "bg-border-soft text-secondary";
  }
}
