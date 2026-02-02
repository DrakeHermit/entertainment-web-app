import NavBar from "@/components/NavBar";
import { getUserData } from "@/lib/auth/checkSessionValid";

const BookmarksLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserData();

  return (
    <div className="md:p-6 lg:p-8">
      <NavBar user={user} />
      <main className="text-white lg:ml-[140px] p-200 md:p-0">
        {children}
      </main>
    </div>
  );
};

export default BookmarksLayout;
