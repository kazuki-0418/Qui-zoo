import AuthButton from "@/app/components/pages/auth/button";
import Input from "@/app/components/pages/auth/input";
import { accountUserInfoSchema, avatarNames } from "@/validations/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type AccountUserInfoFormData = z.infer<typeof accountUserInfoSchema>;
export function AccountUserInfoForm({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: Pick<AccountUserInfoFormData, "username" | "avatar">) => void;
  onBack: () => void;
  defaultValues: Partial<AccountUserInfoFormData>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AccountUserInfoFormData>({
    resolver: zodResolver(accountUserInfoSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = (data: AccountUserInfoFormData) => {
    onNext({
      username: data.username,
      avatar: data.avatar,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Username"
        type="text"
        placeholder="Enter your Username"
        {...register("username")}
        error={errors.username}
      />

      <div className="space-y-2">
        <label htmlFor="avatar" className="block text-sm font-medium">
          Choose your Avatar
        </label>
        <div className="grid grid-cols-3 gap-4 lg:w-2/3 mx-auto">
          {avatarNames.map((avatarName) => {
            const src = `/assets/avatars/${avatarName}.png`;
            return (
              <label
                key={avatarName}
                className="cursor-pointer border rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-400 transition"
              >
                <input
                  type="radio"
                  value={avatarName}
                  id="avatar"
                  {...register("avatar")}
                  className="hidden peer"
                />
                <img
                  src={src}
                  alt={`Avatar of ${avatarName ? avatarName : "default avatar"}`}
                  className="w-full h-auto  peer-checked:border-4 peer-checked:border-blue-400"
                />
              </label>
            );
          })}
        </div>
        {errors.avatar && (
          <p className="text-red-500 text-sm text-center">{errors.avatar.message}</p>
        )}
      </div>

      <div className="flex justify-between flex-col sm:flex-row  gap-6">
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
