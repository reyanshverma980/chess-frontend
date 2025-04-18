import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// Form validation schema
const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be less than 20 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormErrors = {
  username?: string[];
  password?: string[];
  confirmPassword?: string[];
  server?: string[];
};

export function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    try {
      // Validate form data
      signupSchema.parse(data);

      // Call signup function from auth context
      const response = await signup(data.username, data.password);

      if (response.success) {
        // Show success message
        setSuccess(true);
        toast("Account created!", {
          description: "You have successfully created an account.",
        });

        setTimeout(() => {
          navigate("/play-online");
        }, 2000);
      } else {
        if (response.message) {
          setErrors({
            server: [response.message],
          });
        } else {
          setErrors({
            server: ["Failed to create account. Please try again."],
          });
        }
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
          server: ["An unexpected error occurred. Please try again."],
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.server && (
        <Alert
          variant="destructive"
          className="bg-red-900/50 border-red-900 text-white"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.server[0]}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900/50 border-green-900 text-white">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Account created successfully! Redirecting to HomePage...
          </AlertDescription>
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
        <Label htmlFor="password">Password</Label>
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
          <div className="mt-2 text-sm text-red-500">
            <p>Password must:</p>
            <ul className="list-disc pl-5">
              {errors.password.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className={`bg-zinc-900 border-zinc-700 ${
            errors.confirmPassword ? "border-red-500" : ""
          }`}
          disabled={isLoading}
          autoComplete="off"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword[0]}</p>
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
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
