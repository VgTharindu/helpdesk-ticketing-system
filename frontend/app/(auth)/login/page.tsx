'use client';

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/hooks";
import { Button, Input, Card, Spinner } from "@/components/ui";
import { ApiError } from "@/lib/api/errors";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") ?? "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const login = useLogin({ redirectTo });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values);
  };

  return (
    <Card className="w-full max-w-sm">
      <h1 className="mb-1 text-xl font-semibold text-text">Sign in</h1>
      <p className="mb-6 text-sm text-text-muted">Welcome back to Helpdesk.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input type="email" placeholder="Email" {...register("email")} error={errors.email?.message} />
        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
          error={errors.password?.message}
        />

        {login.isError && (
          <p className="text-sm text-danger">
            {login.error instanceof ApiError ? login.error.message : "Something went wrong."}
          </p>
        )}

        <Button type="submit" isLoading={login.isPending}>
          Sign in
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-text-muted">
        No account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <LoginForm />
    </Suspense>
  );
}