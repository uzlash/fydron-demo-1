import { Suspense } from "react";
import { ProfileForm } from "@/app/auth/profile/profile-form";

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileForm />
    </Suspense>
  );
}
