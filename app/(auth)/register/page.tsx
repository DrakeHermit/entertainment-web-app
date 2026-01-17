import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="w-full max-w-[400px] bg-semi-dark-blue rounded-2xl p-8">
      <h1 className="text-[32px] font-light text-white tracking-tight mb-10">
        Sign Up
      </h1>
      <form className="flex flex-col gap-6">
        <div className="relative">
          <input
            type="email"
            placeholder="Email address"
            className="w-full bg-transparent text-white placeholder-white/50 border-b border-white/30 pb-4 pl-4 focus:border-white focus:outline-none caret-red transition-colors"
          />
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent text-white placeholder-white/50 border-b border-white/30 pb-4 pl-4 focus:border-white focus:outline-none caret-red transition-colors"
          />
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="Repeat Password"
            className="w-full bg-transparent text-white placeholder-white/50 border-b border-white/30 pb-4 pl-4 focus:border-white focus:outline-none caret-red transition-colors"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red hover:bg-white hover:text-background text-white py-4 rounded-md font-light text-[15px] mt-4 transition-colors cursor-pointer"
        >
          Create an account
        </button>
        <p className="text-[15px] text-white font-light text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-red hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
export default RegisterPage;
