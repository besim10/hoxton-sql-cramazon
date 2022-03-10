import { Prisma, PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
const prisma = new PrismaClient({
  log: ["query", "error", "warn", "info"],
});
const PORT = 8000;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { orders: { select: { quantity: true, item: true } } },
  });
  res.send(users);
});
app.get("/items", async (req, res) => {
  const items = await prisma.item.findMany({
    include: { orders: { select: { quantity: true, user: true } } },
  });
  res.send(items);
});
app.listen(PORT, () => {
  console.log(`Server up and running: http://localhost:${PORT}`);
});
