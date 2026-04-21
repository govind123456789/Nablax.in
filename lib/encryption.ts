import crypto from "crypto"

const ENCRYPTION_KEY = process.env.DATABASE_ENCRYPTION_KEY || "default-key-change-in-production"
const algorithm = "aes-256-cbc"

// Pad key to 32 bytes if needed
const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32)

export function encryptCredentials(credentials: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)

  let encrypted = cipher.update(credentials, "utf8", "hex")
  encrypted += cipher.final("hex")

  return iv.toString("hex") + ":" + encrypted
}

export function decryptCredentials(encrypted: string): string {
  const parts = encrypted.split(":")
  const iv = Buffer.from(parts[0], "hex")
  const decipher = crypto.createDecipheriv(algorithm, key, iv)

  let decrypted = decipher.update(parts[1], "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
