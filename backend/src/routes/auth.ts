import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma";
import { signToken, verifyToken, getTokenFromCookie } from "../jwt";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Wrong password" });
    const token = signToken({ userId: user.id });
    res.cookie("token", token, { httpOnly: true, secure: false, path: "/", maxAge: 60 * 60 * 24 * 7 * 1000, sameSite: "lax" });
    return res.status(200).json({ message: "Login successful" });
  } catch {
    return res.status(500).json({ error: "Login failed" });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already in use" });
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name, email, password: hashed,
        accounts: {
          create: {
            iban: "GB" + Math.floor(Math.random() * 9000000000 + 1000000000).toString(),
            balance: 1000, bonusGranted: true,
            transactions: { create: { type: "DEPOSIT", amount: 1000, description: "🎉 Welcome Bonus — Thanks for joining SilverBank!" } }
          }
        }
      }
    });
    return res.status(201).json({ message: "Account created" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  res.cookie("token", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res.status(200).json({ message: "Logged out" });
});

router.delete("/delete", async (req: Request, res: Response) => {
  try {
    const token = getTokenFromCookie(req.headers.cookie);
    const decoded = verifyToken(token || "");
    if (!decoded) return res.status(401).json({ error: "Unauthorized" });
    const userId = decoded.userId;
    await prisma.$transaction([
      prisma.cashEntry.deleteMany({ where: { userId } }),
      prisma.transaction.deleteMany({ where: { account: { userId } } }),
      prisma.account.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
    res.cookie("token", "", { maxAge: 0 });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
