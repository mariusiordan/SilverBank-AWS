import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { verifyToken, getTokenFromCookie } from "../jwt";

const router = Router();

function getUserId(cookieHeader: string | undefined): number | null {
  const token = getTokenFromCookie(cookieHeader);
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded?.userId ?? null;
}

router.get("/", async (req: Request, res: Response) => {
  const userId = getUserId(req.headers.cookie);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const entries = await prisma.cashEntry.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return res.status(200).json(entries);
});

router.post("/", async (req: Request, res: Response) => {
  const userId = getUserId(req.headers.cookie);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { description, amount, category } = req.body;
  if (!description || !amount || !category) return res.status(400).json({ error: "Missing fields" });
  const entry = await prisma.cashEntry.create({ data: { description, amount: Number(amount), category, userId } });
  return res.status(201).json(entry);
});

router.delete("/", async (req: Request, res: Response) => {
  const userId = getUserId(req.headers.cookie);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.body;
  await prisma.cashEntry.deleteMany({ where: { id, userId } });
  return res.status(200).json({ message: "Deleted" });
});

export default router;
