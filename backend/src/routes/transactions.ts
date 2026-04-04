import { Router, Request, Response } from "express";
import prisma from "../prisma";
import { verifyToken, getTokenFromCookie } from "../jwt";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const token = getTokenFromCookie(req.headers.cookie);
    const decoded = verifyToken(token || "");
    if (!decoded) return res.status(401).json({ error: "Unauthorized" });
    const account = await prisma.account.findFirst({ where: { userId: decoded.userId }, include: { transactions: { orderBy: { createdAt: "desc" } } } });
    if (!account) return res.status(404).json({ error: "Account not found" });
    return res.status(200).json(account.transactions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/transfer", async (req: Request, res: Response) => {
  try {
    const token = getTokenFromCookie(req.headers.cookie);
    const decoded = verifyToken(token || "");
    if (!decoded) return res.status(401).json({ error: "Unauthorized" });
    const { toIban, amount } = req.body;
    if (!toIban || !amount || amount <= 0) return res.status(400).json({ error: "Invalid transfer data" });
    const senderAccount = await prisma.account.findFirst({ where: { userId: decoded.userId } });
    if (!senderAccount) return res.status(404).json({ error: "Sender account not found" });
    if (senderAccount.balance < amount) return res.status(400).json({ error: "Insufficient balance" });
    const receiverAccount = await prisma.account.findFirst({ where: { iban: toIban } });
    if (!receiverAccount) return res.status(404).json({ error: "Recipient IBAN not found" });
    await prisma.$transaction([
      prisma.account.update({ where: { id: senderAccount.id }, data: { balance: { decrement: amount } } }),
      prisma.account.update({ where: { id: receiverAccount.id }, data: { balance: { increment: amount } } }),
      prisma.transaction.create({ data: { type: "WITHDRAW", amount, description: `Transfer to ${toIban}`, accountId: senderAccount.id } }),
      prisma.transaction.create({ data: { type: "DEPOSIT", amount, description: `Received from ${senderAccount.iban}`, accountId: receiverAccount.id } }),
    ]);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/loan", async (req: Request, res: Response) => {
  try {
    const token = getTokenFromCookie(req.headers.cookie);
    const decoded = verifyToken(token || "");
    if (!decoded) return res.status(401).json({ error: "Unauthorized" });
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });
    const account = await prisma.account.findFirst({ where: { userId: decoded.userId } });
    if (!account) return res.status(404).json({ error: "Account not found" });
    await prisma.$transaction([
      prisma.account.update({ where: { id: account.id }, data: { balance: { increment: amount } } }),
      prisma.transaction.create({ data: { type: "DEPOSIT", amount, description: "Loan Approved", accountId: account.id } }),
    ]);
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
