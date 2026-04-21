import bcrypt from "bcryptjs"

let sql: any = null

function getSqlClient() {
  if (!sql && process.env.DATABASE_URL) {
    const { neon } = require("@neondatabase/serverless")
    sql = neon(process.env.DATABASE_URL)
  }
  return sql
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(email: string, password: string, fullName: string) {
  const sqlClient = getSqlClient()
  if (!sqlClient) {
    return { success: false, error: "Database not configured" }
  }

  const passwordHash = await hashPassword(password)

  try {
    const result = await sqlClient(
      `INSERT INTO query_app_users (email, password_hash, full_name) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, full_name, created_at`,
      [email, passwordHash, fullName],
    )

    return { success: true, user: result[0] }
  } catch (error: any) {
    if (error.message.includes("unique constraint")) {
      return { success: false, error: "Email already exists" }
    }
    return { success: false, error: "Failed to create user" }
  }
}

export async function authenticateUser(email: string, password: string) {
  const sqlClient = getSqlClient()
  if (!sqlClient) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const result = await sqlClient(`SELECT id, email, password_hash, full_name FROM query_app_users WHERE email = $1`, [
      email,
    ])

    if (result.length === 0) {
      return { success: false, error: "User not found" }
    }

    const user = result[0]
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return { success: false, error: "Invalid password" }
    }

    return { success: true, user: { id: user.id, email: user.email, fullName: user.full_name } }
  } catch (error) {
    return { success: false, error: "Authentication failed" }
  }
}

export async function getUserById(userId: string) {
  const sqlClient = getSqlClient()
  if (!sqlClient) {
    return null
  }

  try {
    const result = await sqlClient(`SELECT id, email, full_name, created_at FROM query_app_users WHERE id = $1`, [
      userId,
    ])

    return result.length > 0 ? result[0] : null
  } catch (error) {
    return null
  }
}
