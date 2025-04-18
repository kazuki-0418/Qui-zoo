"use client";
import { Card } from "flowbite-react";
import LogInForm from "./LogInInfoForm";

export function LogIn() {
  return (
    <Card className="max-w-sm">
      <div className="mb-2 block">
        <h1 className="text-[2rem] text-center">Sign In</h1>
      </div>
      <div className="mb-2 block">
        <p className="text-base text-center text-gray-400">
          Enter your email and password to continue
        </p>
      </div>
      <LogInForm />
    </Card>
  );
}
