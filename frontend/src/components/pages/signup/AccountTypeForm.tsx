import AuthButton from "@/app/components/pages/auth/button";
import { type CreateUser, accountTypes } from "@/validations/auth/User";
import { accountTypeSchema } from "@/validations/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type Role = CreateUser["role"];
type AccountTypeFormData = z.infer<typeof accountTypeSchema>;

export function AccountTypeForm({
  onNext,
  defaultValues,
}: {
  onNext: (data: { role: Role }) => void;
  defaultValues: { accountType: Role | undefined };
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<AccountTypeFormData>({
    resolver: zodResolver(accountTypeSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const selectedType = watch("accountType");

  const onSubmit = (data: AccountTypeFormData) => {
    onNext({ role: data.accountType });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col gap-4">
        {accountTypes.map((type) => {
          const isSelected = selectedType === type;
          const hasError = errors.accountType && !selectedType;

          return (
            <label
              key={type}
              className={`border p-4 rounded-lg cursor-pointer transition-colors
                ${isSelected ? "bg-blue-100 border-blue-500" : ""}
                ${hasError ? "border-red-500" : "border-gray-300"}`}
            >
              <input
                type="radio"
                value={type}
                {...register("accountType")}
                className="hidden peer"
              />
              <div className="text-lg capitalize">{type}</div>
            </label>
          );
        })}
      </div>

      {errors.accountType && <p className="text-red-500 text-sm">{errors.accountType.message}</p>}

      <div className="flex justify-end flex-col sm:flex-row">
        <AuthButton type="submit" variant="primary">
          Next
        </AuthButton>
      </div>
    </form>
  );
}
