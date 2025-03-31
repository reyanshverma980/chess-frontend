import { Link, Outlet } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <div className="relative">
      <header className="absolute left-0 right-0 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/chess-logo.svg"
              alt="Chess Game Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold text-white">ChessGame</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden text-zinc-400 md:inline-block">
                  Welcome,{" "}
                  <span className="font-medium text-white truncate">
                    {user.username}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-zinc-400"
                  onClick={logout}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-zinc-400"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
