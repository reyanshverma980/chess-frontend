import { Link, Navigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";

export default function LoginPage() {
  const { user } = useAuth();

  if (user?.userId) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-900 text-white">
      <Header />

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold">Log In</h1>
          <LoginForm />
          <div className="mt-6 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-green-500 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
