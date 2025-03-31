import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Form validation schema
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormErrors = {
  username?: string[];
  password?: string[];
  auth?: string[];
};

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    try {
      // Validate form data
      loginSchema.parse(data);

      // Call login function from auth context
      const response = await login(data.username, data.password);

      if (response.success) {
        navigate("/");
      } else {
        setErrors({
          auth: ["Invalid username or password"],
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field]?.push(err.message);
        });
        setErrors(fieldErrors);
      } else {
        setErrors({
          auth: ["An unexpected error occurred. Please try again."],
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.auth && (
        <Alert
          variant="destructive"
          className="bg-red-900/50 border-red-900 text-white"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.auth[0]}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="YourChessUsername"
          className={`bg-zinc-900 border-zinc-700 ${
            errors.username ? "border-red-500" : ""
          }`}
          disabled={isLoading}
          autoComplete="off"
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            to="/forgot-password"
            className="text-xs text-green-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          className={`bg-zinc-900 border-zinc-700 ${
            errors.password ? "border-red-500" : ""
          }`}
          disabled={isLoading}
          autoComplete="off"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Log In"
        )}
      </Button>
    </form>
  );
}
