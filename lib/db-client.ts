// Database client for Data Dictionary storage
// Implements singleton pattern for reliability

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// For server-side operations with admin privileges
let adminClient: ReturnType<typeof createServerClient> | null = null

export async function getAdminDbClient() {
  if (adminClient) {
    return adminClient
  }

  const cookieStore = await cookies()

  adminClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Handle cookie setting errors
          }
        },
      },
    },
  )

  return adminClient
}

// Non-admin client for user queries
let userClient: ReturnType<typeof createServerClient> | null = null

export async function getUserDbClient() {
  if (userClient) {
    return userClient
  }

  const cookieStore = await cookies()

  userClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Handle cookie setting errors
          }
        },
      },
    },
  )

  return userClient
}
