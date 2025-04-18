import { Link, Navigate } from "react-router-dom";
import { SignupForm } from "../components/SignupForm";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { user } = useAuth();

  if (user?.userId) {
    return <Navigate to="/play-online" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-900 text-white">
      <Header />

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold">
            Create an Account
          </h1>
          <SignupForm />
          <div className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link to="/login" className="text-green-500 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
