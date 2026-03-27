import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";
import ProfileEditor from "../_components/ProfileEditor";

export default async function EditProfilePage() {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <ProfileEditor />;
}

