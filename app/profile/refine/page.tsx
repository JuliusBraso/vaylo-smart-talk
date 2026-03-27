import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";
import RefineProfile from "../_components/RefineProfile";

export default async function RefineProfilePage() {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <RefineProfile />;
}

