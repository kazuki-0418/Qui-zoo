"use client";
import AuthButton from "@/app/components/pages/auth/button";
import Input from "@/app/components/pages/auth/input";
import type { CreateUser } from "@/validations/auth/User";
import {
  accountTypeSchema,
  accountTypes,
  accountUserInfoSchema,
  avatarNames,
  basicInfoSchema,
} from "@/validations/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type StepperProps = {
  step: number;
};

const steps = ["Account Type", "Personal Info", "Account Info", "Confirmation"];

function Stepper({ step }: StepperProps) {
  return (
    <ol className="flex justify-between items-center w-full px-4">
      {steps.map((label, index) => {
        const isCompleted = index < step - 1;
        const isActive = index === step - 1;
        const isLast = index === steps.length - 1;

        return (
          <li key={label} className="flex-1 relative flex flex-col items-center text-center">
            <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">{label}</div>
            <div
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 
            ${
              isCompleted
                ? "bg-green-200 border-white dark:bg-green-900"
                : isActive
                  ? "bg-blue-300 border-white dark:bg-blue-900"
                  : "bg-gray-200 border-white dark:bg-gray-700"
            }
          `}
            >
              {isCompleted ? (
                <svg
                  className="w-4 h-4 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <title>section</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="w-2.5 h-2.5 rounded-full" />
              )}
            </div>
            {!isLast && (
              <div className="absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 z-0">
                <div
                  className={`h-full ${
                    isCompleted ? "bg-green-300 dark:bg-green-700" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  style={{ marginTop: "1.75rem", width: "100%" }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

type Role = CreateUser["role"];
type AccountTypeFormData = z.infer<typeof accountTypeSchema>;

function AccountTypeForm({
  onNext,
}: {
  onNext: (data: { role: Role }) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AccountTypeFormData>({
    resolver: zodResolver(accountTypeSchema),
    defaultValues: {
      accountType: undefined,
    },
  });

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

      <div className="flex justify-end">
        <AuthButton type="submit" variant="primary">
          Next
        </AuthButton>
      </div>
    </form>
  );
}

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
function BasicUserInfoForm({
  onNext,
  onBack,
}: {
  onNext: (data: Pick<BasicInfoFormData, "email" | "password">) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
  });

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

type AccountUserInfoFormData = z.infer<typeof accountUserInfoSchema>;
function AccountUserInfoFrom({
  onNext,
  onBack,
}: {
  onNext: (data: Pick<AccountUserInfoFormData, "username" | "avatar">) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountUserInfoFormData>({
    resolver: zodResolver(accountUserInfoSchema),
  });
  const onSubmit = (data: AccountUserInfoFormData) => {
    onNext({
      username: data.username,
      avatar: data.avatar || null,
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
        <div className="grid grid-cols-3 gap-4 w-2/3 mx-auto">
          {avatarNames.map((avatarName) => {
            const src = `/assets/avatars/${avatarName}.png`;
            return (
              <label
                key={avatarName}
                className="cursor-pointer border rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition"
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
                  className="w-full h-auto peer-checked:ring-4 peer-checked:ring-blue-500"
                />
              </label>
            );
          })}
        </div>
        {errors.avatar && (
          <p className="text-red-500 text-sm text-center">{errors.avatar.message}</p>
        )}
      </div>

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

type ConfirmationSectionProps = {
  formData: Partial<CreateUser>;
  onBack: () => void;
  handleSubmit: () => void;
};

function ConfirmationSection({ formData, onBack, handleSubmit }: ConfirmationSectionProps) {
  const src = `/assets/avatars/${formData.avatar}.png`;
  return (
    <div className="space-y-6 text-center">
      <ul className="space-y-4 inline-block text-left">
        <li>
          <strong>Account Type:</strong> {formData.role}
        </li>
        <li>
          <strong>Email:</strong> {formData.email}
        </li>
        <li>
          <strong>Username:</strong> {formData.username}
        </li>
        <li>
          <strong>Avatar:</strong>
          <br />
          {formData.avatar && <img src={src} alt="Avatar" className="w-24 h-24 mx-auto" />}
        </li>
      </ul>

      <div className="flex justify-between mt-8">
        <AuthButton type="button" variant="secondary" onClick={onBack}>
          Back
        </AuthButton>
        <AuthButton type="button" variant="primary" onClick={handleSubmit}>
          Submit
        </AuthButton>
      </div>
    </div>
  );
}

enum SignUpStep {
  AccountType = 1,
  PersonalInfo = 2,
  AccountInfo = 3,
  Confirmation = 4,
}

export default function Signup() {
  const [step, setStep] = useState<SignUpStep>(SignUpStep.AccountType);
  const [formData, setFormData] = useState<Partial<CreateUser>>({});

  const router = useRouter();
  const onSubmit = async () => {
    try {
      router.push("/dashboard");
    } catch {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="p-6  w-full mx-auto ">
      <div>
        <Stepper step={step} />
        {/* To test data is straged */}
        {/* <pre className="text-xs bg-gray-100 p-2 rounded border border-gray-300">
        {JSON.stringify(formData, null, 2)}
      </pre> */}
      </div>
      <div className="mt-8 mx-30">
        {step === 1 && (
          <AccountTypeForm
            onNext={(data) => {
              setFormData((prev) => ({ ...prev, role: data.role }));
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <BasicUserInfoForm
            onNext={(data) => {
              setFormData((prev) => ({
                ...prev,
                email: data.email,
                password: data.password,
              }));
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <AccountUserInfoFrom
            onNext={(data) => {
              setFormData((prev) => ({
                ...prev,
                username: data.username,
                avatar: data.avatar || undefined,
              }));
              setStep(4);
            }}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <ConfirmationSection
            formData={formData}
            onBack={() => setStep(3)}
            handleSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
}
