import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString(), 
      database: "connected", 
      version: process.env.APP_VERSION || "1.0.0",
      environment: process.env.DEPLOY_ENV || "unknown",
      image_tag: process.env.IMAGE_TAG || "unknown"
});
  } catch {
    return res.status(503).json({ status: "error", database: "disconnected" });
  }
});

export default router;
