import { Suspense } from "react";
import { CreatePasswordForm } from "@/app/auth/create-password/create-password-form";

export default function CreatePasswordPage() {
  return (
    <Suspense fallback={null}>
      <CreatePasswordForm />
    </Suspense>
  );
}
