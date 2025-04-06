"use client"

import { UserProvider } from "@auth0/nextjs-auth0/client"
import type React from "react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>
}

