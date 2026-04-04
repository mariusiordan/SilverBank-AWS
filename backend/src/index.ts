import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import accountRoutes from "./routes/account";
import cashRoutes from "./routes/cash";
import transactionRoutes from "./routes/transactions";
import healthRoutes from "./routes/health";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/cash", cashRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/health", healthRoutes);

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ SilverBank API running on port ${PORT}`);
  });
}

export default app;
