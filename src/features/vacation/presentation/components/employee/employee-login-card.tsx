"use client";
// ==============================================================================
// features/vacation/presentation/components/employee/employee-login-card.tsx
// Dedicated Login Card for Employee Portal
// ==============================================================================
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Label,
} from "@shared/ui";
import { createClient } from "@core/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function EmployeeLoginCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();

      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });

      if (authError) {
        throw new Error(authError.message || "Invalid email or password.");
      }

      if (!authData.user) {
        throw new Error("Login failed. Please try again.");
      }

      // 2. Verify employee profile exists via RPC
      const { data: profileData, error: profileError } = await (supabase.rpc as CallableFunction)(
        "get_current_employee_profile"
      );

      if (profileError || !profileData || (Array.isArray(profileData) && profileData.length === 0)) {
        // Sign out immediately if not registered as employee
        await supabase.auth.signOut();
        throw new Error("This account is not registered as an employee.");
      }

      toast.success("Welcome back!");
      router.replace(`/${locale}/employee/vacation`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border bg-card">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Lock className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl font-bold">Employee Portal</CardTitle>
        <CardDescription className="text-xs">
          Sign in to access your vacation balance, leave requests, and employee profile.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">
              Employee Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@ruknalassi.com"
                className="pl-9 text-xs"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-9 text-xs"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-destructive">{errors.password.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button type="submit" className="w-full text-xs font-semibold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In to Portal
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
