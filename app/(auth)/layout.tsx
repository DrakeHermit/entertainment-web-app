import Image from "next/image";
import logo from "@/assets/logo.svg";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center gap-16 p-6">
      <Image src={logo} alt="Entertainment App Logo" width={33} height={27} />
      {children}
    </div>
  );
};
export default AuthLayout;
