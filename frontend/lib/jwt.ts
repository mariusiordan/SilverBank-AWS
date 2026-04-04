import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;
if (!SECRET) console.error("❌ Missing JWT_SECRET in .env");

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    return { userId: decoded.userId };
  } catch {
    return null;
  }
}
