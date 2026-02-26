import express from "express";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get all commitments (simulating Merkle Tree leaves)
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
      id: crypto.randomUUID(),
      hash,
      amount,
      timestamp: Date.now(),
      spent: false,
    };

    commitments.push(commitment);
    res.json({ success: true, commitment });
  });

  // Spend zBTC (Submit Nullifier and Proof)
  app.post("/api/spend", (req, res) => {
    const { nullifier, proof, commitmentId } = req.body;
    
    if (nullifiers.has(nullifier)) {
      return res.status(400).json({ error: "Double spend detected! Nullifier already used." });
    }

    // Simulate proof verification
    if (!proof || proof !== "valid_stark_proof") {
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

    res.json({ success: true, message: "Private transfer successful" });
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
