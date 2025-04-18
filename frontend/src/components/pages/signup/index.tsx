"use client";
import { useAuthStore } from "@/app/auth/store/useAuthStore";
import type { CreateUser, Role } from "@/validations/auth/User";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AccountTypeForm } from "./AccountTypeForm";
import { AccountUserInfoForm } from "./AccountUserInfoForm";
import { BasicUserInfoForm } from "./BasicInfoForm";
import { ConfirmationSection } from "./Confirmation";
import { Stepper } from "./Stepper";

enum SignUpStep {
  AccountType = 1,
  PersonalInfo = 2,
  AccountInfo = 3,
  Confirmation = 4,
}

export default function Signup() {
  const [step, setStep] = useState<SignUpStep>(SignUpStep.AccountType);
  const [formData, setFormData] = useState<CreateUser>({
    email: "",
    password: "",
    username: "",
    role: "" as Role,
    avatar: "",
  });
  const { push } = useRouter();

  const { signUp, isLoading } = useAuthStore();

  const onSubmit = async () => {
    try {
      signUp({
        ...formData,
      }).then(() => {
        alert("Registration successful! Please check your email for verification.");
        push("/");
      });
    } catch {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="p-6 w-full max-w-4xl">
      <div>
        <Stepper step={step} />
      </div>
      <div className="mt-8 w-[60%] mx-auto">
        {step === SignUpStep.AccountType && (
          <AccountTypeForm
            onNext={(data) => {
              setFormData((prev) => ({ ...prev, role: data.role }));
              setStep(SignUpStep.PersonalInfo);
            }}
            defaultValues={{ accountType: formData.role }}
          />
        )}

        {step === SignUpStep.PersonalInfo && (
          <BasicUserInfoForm
            onNext={(data) => {
              setFormData((prev) => ({
                ...prev,
                email: data.email,
                password: data.password,
              }));
              setStep(SignUpStep.AccountInfo);
            }}
            onBack={() => setStep(SignUpStep.AccountType)}
            defaultValues={{
              email: formData.email || "",
              password: formData.password || "",
              confirmPassword: "",
            }}
          />
        )}

        {step === SignUpStep.AccountInfo && (
          <AccountUserInfoForm
            onNext={(data) => {
              setFormData((prev) => ({
                ...prev,
                username: data.username,
                avatar: data.avatar,
              }));
              setStep(SignUpStep.Confirmation);
            }}
            onBack={() => setStep(SignUpStep.PersonalInfo)}
            defaultValues={{
              username: formData.username || "",
              avatar: formData.avatar || undefined,
            }}
          />
        )}

        {step === SignUpStep.Confirmation && (
          <ConfirmationSection
            formData={formData}
            onBack={() => setStep(SignUpStep.AccountInfo)}
            handleSubmit={onSubmit}
            isSubmitting={isLoading}
          />
        )}
      </div>
    </div>
  );
}
