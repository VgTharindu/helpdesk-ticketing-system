'use client';

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas";
import { useRegister } from "@/features/auth/hooks";
import { Button, Input, Card } from "@/components/ui";
import { ApiError } from "@/lib/api/errors";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const registerUser = useRegister();

  const onSubmit = (values: RegisterFormValues) => {
    registerUser.mutate(values);
  };

  return (
    <Card className="w-full max-w-sm">
      <h1 className="mb-1 text-xl font-semibold text-text">Create an account</h1>
      <p className="mb-6 text-sm text-text-muted">Sign up as a customer.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input placeholder="Full name" {...register("name")} error={errors.name?.message} />
        <Input type="email" placeholder="Email" {...register("email")} error={errors.email?.message} />
        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
          error={errors.password?.message}
        />
        <Input
          type="password"
          placeholder="Confirm password"
          {...register("password_confirmation")}
          error={errors.password_confirmation?.message}
        />

        {registerUser.isError && (
          <p className="text-sm text-danger">
            {registerUser.error instanceof ApiError ? registerUser.error.message : "Something went wrong."}
          </p>
        )}

        <Button type="submit" isLoading={registerUser.isPending}>
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}