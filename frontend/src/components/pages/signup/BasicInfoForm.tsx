import AuthButton from "@/app/components/pages/auth/button";
import Input from "@/app/components/pages/auth/input";
import { basicInfoSchema } from "@/validations/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

export function BasicUserInfoForm({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: Pick<BasicInfoFormData, "email" | "password">) => void;
  onBack: () => void;
  defaultValues: Partial<BasicInfoFormData>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = (data: BasicInfoFormData) => {
    onNext({
      email: data.email,
      password: data.password,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Email"
        type="email"
        placeholder="example@email.com"
        {...register("email")}
        error={errors.email}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your Password"
        {...register("password")}
        error={errors.password}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your Password"
        {...register("confirmPassword")}
        error={errors.confirmPassword}
      />

      <div className="flex justify-between">
        <AuthButton type="button" variant="secondary" onClick={onBack}>
          Back
        </AuthButton>
        <AuthButton type="submit" variant="primary">
          Next
        </AuthButton>
      </div>
    </form>
  );
}
