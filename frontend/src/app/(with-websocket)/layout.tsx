"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ProtectedRoute } from "@/app/(no-websocket)/auth/hooks/ProtectedRoute";
import { useAuthStore } from "@/app/(no-websocket)/auth/store/useAuthStore";
import { QuizProvider } from "@/contexts/QuizContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const sessionId = typeof params?.sessionId === "string" ? params.sessionId : "";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <WebSocketProvider>
            <QuizProvider sessionId={sessionId} isHost={false}>
              <ProtectedRoute>{children}</ProtectedRoute>
            </QuizProvider>
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
