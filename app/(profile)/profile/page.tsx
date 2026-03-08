import { redirect } from "next/navigation";
import { getUserData } from "@/lib/auth/checkSessionValid";
import ProfilePage from "@/components/ProfilePage";

const ProfileRoute = async () => {
  const user = await getUserData();

  if (!user) {
    redirect("/login");
  }

  return <ProfilePage user={user} />;
};

export default ProfileRoute;
