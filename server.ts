import express from "express";
import { createServer as createViteServer } from "vite";

// Simple ID generator for compatibility
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Mock database for simulation
interface Commitment {
  id: string;
  hash: string;
  amount: number;
  timestamp: number;
  spent: boolean;
}

const commitments: Commitment[] = [];
const nullifiers = new Set<string>();
const history: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get transaction history
  app.get("/api/history", (req, res) => {
    res.json(history);
  });

  // Get all commitments
  app.get("/api/commitments", (req, res) => {
    res.json(commitments);
  });

  // Mint zBTC (Create Commitment)
  app.post("/api/mint", (req, res) => {
    const { hash, amount } = req.body;
    if (!hash || !amount) {
      return res.status(400).json({ error: "Missing hash or amount" });
    }

    const commitment: Commitment = {
      id: generateId(),
      hash,
      amount,
      timestamp: Date.now(),
      spent: false,
    };

    commitments.push(commitment);
    history.unshift({
      id: generateId(),
      type: 'mint',
      amount: amount.toFixed(4),
      timestamp: 'Just now',
      status: 'confirmed'
    });
    res.json({ success: true, commitment });
  });

  // Spend zBTC (Submit Nullifier and Proof)
  app.post("/api/spend", (req, res) => {
    const { nullifier, proof, commitmentId } = req.body;
    
    if (nullifiers.has(nullifier)) {
      return res.status(400).json({ error: "Double spend detected! Nullifier already used." });
    }

    if (!proof || proof === "") {
      return res.status(400).json({ error: "Invalid ZK proof" });
    }

    const commitment = commitments.find(c => c.id === commitmentId);
    if (!commitment) {
      return res.status(404).json({ error: "Commitment not found" });
    }

    if (commitment.spent) {
      return res.status(400).json({ error: "Commitment already spent" });
    }

    commitment.spent = true;
    nullifiers.add(nullifier);

    history.unshift({
      id: generateId(),
      type: 'transfer',
      amount: commitment.amount.toFixed(4),
      timestamp: 'Just now',
      status: 'confirmed'
    });

    res.json({ success: true, message: "Private transfer successful" });
  });

  // Withdraw zBTC (Burn Commitment and return BTC)
  app.post("/api/withdraw", (req, res) => {
    const { commitmentId, address } = req.body;
    const commitment = commitments.find(c => c.id === commitmentId);
    
    if (!commitment || commitment.spent) {
      return res.status(400).json({ error: "Invalid or spent commitment" });
    }

    commitment.spent = true;
    history.unshift({
      id: generateId(),
      type: 'withdraw',
      amount: commitment.amount.toFixed(4),
      timestamp: 'Just now',
      status: 'confirmed'
    });

    res.json({ success: true, message: `Withdrawn to ${address}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ShadowBTC Server running on http://localhost:${PORT}`);
  });
}

startServer();
