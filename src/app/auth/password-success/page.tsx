import { Suspense } from "react";
import { PasswordSuccessContent } from "@/app/auth/password-success/password-success-content";

export default function PasswordSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PasswordSuccessContent />
    </Suspense>
  );
}
