import Home from "./pages/Home";
import Game from "./pages/Game";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import PlayOnline from "./pages/PlayOnline";
import PlayComputer from "./pages/PlayComputer";

const ProtectedRoute = () => {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-neutral-800">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<Header />}>
              <Route path="/play-computer" element={<PlayComputer />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/play-online" element={<PlayOnline />} />
                <Route path="/game" element={<Game />} />
                <Route path="/game/:id" element={<Game />} />
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
