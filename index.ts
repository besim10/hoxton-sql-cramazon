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

app.get("/users/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        orders: {
          select: { item: true, quantity: true },
        },
      },
    });

    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ error: "User not found." });
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});
app.get("/items", async (req, res) => {
  const items = await prisma.item.findMany({
    include: { orders: { select: { quantity: true, user: true } } },
  });
  res.send(items);
});
app.get("/items/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const item = await prisma.item.findUnique({
      where: { title },
      include: {
        orders: {
          select: { user: true, quantity: true },
        },
      },
    });

    if (item) {
      res.send(item);
    } else {
      res.status(404).send({ error: "item not found." });
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server up and running: http://localhost:${PORT}`);
});
