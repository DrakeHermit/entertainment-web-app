import NavBar from "@/components/NavBar";

const DetailsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="md:p-6 lg:p-8">
      <NavBar />
      <main className="text-white lg:ml-[140px] p-200 md:p-0">
        {children}
      </main>
    </div>
  );
};

export default DetailsLayout;
