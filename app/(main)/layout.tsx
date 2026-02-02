import NavBar from "@/components/NavBar";
import SearchComponent from "@/components/SearchComponent";
import { getUserData } from "@/lib/auth/checkSessionValid";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserData();

  return (
    <div className="md:p-6 lg:p-8">
      <NavBar user={user} />
      <main className="text-white lg:ml-[140px] p-200 md:p-0">
        <SearchComponent />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
