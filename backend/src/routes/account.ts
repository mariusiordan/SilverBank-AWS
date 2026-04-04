import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { verifyToken, getTokenFromCookie } from "../jwt";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const token = getTokenFromCookie(req.headers.cookie);
  if (!token) return res.status(401).json({ error: "No token" });
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: "Invalid token" });
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { accounts: { include: { transactions: true } } },
  });
  if (!user || user.accounts.length === 0) return res.status(404).json({ error: "No account found" });
  return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, account: user.accounts[0] });
});

router.get("/all", (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Lista conturi" });
});

export default router;
