import express from "express";
import { createServer as createViteServer } from "vite";
import BetterSqlite3 from "better-sqlite3";
import path from "path";

// Initialize Database
const db = new BetterSqlite3("shadowbtc.db");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS commitments (
    id TEXT PRIMARY KEY,
    hash TEXT NOT NULL,
    amount REAL NOT NULL,
    timestamp INTEGER NOT NULL,
    spent INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS nullifiers (
    value TEXT PRIMARY KEY
  );

  CREATE TABLE IF NOT EXISTS history (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    amount TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL
  );
`);

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

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
    const rows = db.prepare("SELECT * FROM history ORDER BY rowid DESC LIMIT 50").all();
    res.json(rows);
  });

  // Get all commitments
  app.get("/api/commitments", (req, res) => {
    const rows = db.prepare("SELECT * FROM commitments WHERE spent = 0").all();
    res.json(rows);
  });

  // Mint zBTC (Create Commitment)
  app.post("/api/mint", (req, res) => {
    const { hash, amount } = req.body;
    if (!hash || !amount) {
      return res.status(400).json({ error: "Missing hash or amount" });
    }

    const id = generateId();
    const timestamp = Date.now();

    try {
      const insertCommitment = db.prepare("INSERT INTO commitments (id, hash, amount, timestamp) VALUES (?, ?, ?, ?)");
      insertCommitment.run(id, hash, amount, timestamp);

      const insertHistory = db.prepare("INSERT INTO history (id, type, amount, timestamp, status) VALUES (?, ?, ?, ?, ?)");
      insertHistory.run(generateId(), 'mint', amount.toFixed(4), 'Just now', 'confirmed');

      res.json({ success: true, commitment: { id, hash, amount, timestamp, spent: 0 } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Spend zBTC (Submit Nullifier and Proof)
  app.post("/api/spend", (req, res) => {
    const { nullifier, proof, commitmentId } = req.body;
    
    // Check if nullifier exists
    const existingNullifier = db.prepare("SELECT value FROM nullifiers WHERE value = ?").get(nullifier);
    if (existingNullifier) {
      return res.status(400).json({ error: "Double spend detected! Nullifier already used." });
    }

    if (!proof || proof === "") {
      return res.status(400).json({ error: "Invalid ZK proof" });
    }

    const commitment = db.prepare("SELECT * FROM commitments WHERE id = ?").get(commitmentId) as any;
    if (!commitment) {
      return res.status(404).json({ error: "Commitment not found" });
    }

    if (commitment.spent) {
      return res.status(400).json({ error: "Commitment already spent" });
    }

    try {
      const updateCommitment = db.prepare("UPDATE commitments SET spent = 1 WHERE id = ?");
      const insertNullifier = db.prepare("INSERT INTO nullifiers (value) VALUES (?)");
      const insertHistory = db.prepare("INSERT INTO history (id, type, amount, timestamp, status) VALUES (?, ?, ?, ?, ?)");

      const transaction = db.transaction(() => {
        updateCommitment.run(commitmentId);
        insertNullifier.run(nullifier);
        insertHistory.run(generateId(), 'transfer', commitment.amount.toFixed(4), 'Just now', 'confirmed');
      });

      transaction();
      res.json({ success: true, message: "Private transfer successful" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Withdraw zBTC (Burn Commitment and return BTC)
  app.post("/api/withdraw", (req, res) => {
    const { commitmentId, address } = req.body;
    const commitment = db.prepare("SELECT * FROM commitments WHERE id = ?").get(commitmentId) as any;
    
    if (!commitment || commitment.spent) {
      return res.status(400).json({ error: "Invalid or spent commitment" });
    }

    try {
      const updateCommitment = db.prepare("UPDATE commitments SET spent = 1 WHERE id = ?");
      const insertHistory = db.prepare("INSERT INTO history (id, type, amount, timestamp, status) VALUES (?, ?, ?, ?, ?)");

      const transaction = db.transaction(() => {
        updateCommitment.run(commitmentId);
        insertHistory.run(generateId(), 'withdraw', commitment.amount.toFixed(4), 'Just now', 'confirmed');
      });

      transaction();
      res.json({ success: true, message: `Withdrawn to ${address}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reset Protocol (Danger Zone)
  app.post("/api/reset", (req, res) => {
    try {
      db.exec("DELETE FROM commitments; DELETE FROM nullifiers; DELETE FROM history;");
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Protocol Stats
  app.get("/api/stats", (req, res) => {
    try {
      const totalCommitments = db.prepare("SELECT COUNT(*) as count FROM commitments").get() as any;
      const spentCommitments = db.prepare("SELECT COUNT(*) as count FROM commitments WHERE spent = 1").get() as any;
      const totalTVL = db.prepare("SELECT SUM(amount) as sum FROM commitments WHERE spent = 0").get() as any;
      const totalHistory = db.prepare("SELECT COUNT(*) as count FROM history").get() as any;

      res.json({
        tvl: totalTVL.sum || 0,
        proofs: (totalCommitments.count + spentCommitments.count) * 1.5, // Simulated proof count
        historyCount: totalHistory.count,
        privacyScore: 95 + Math.min(5, totalCommitments.count / 10) // Simulated privacy score
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Search Endpoint
  app.get("/api/search", (req, res) => {
    const { q } = req.query;
    if (!q) return res.json({ results: [] });

    try {
      const historyResults = db.prepare("SELECT * FROM history WHERE id LIKE ? OR type LIKE ? OR amount LIKE ?").all(`%${q}%`, `%${q}%`, `%${q}%`);
      const commitmentResults = db.prepare("SELECT * FROM commitments WHERE id LIKE ? OR hash LIKE ?").all(`%${q}%`, `%${q}%`);
      
      res.json({
        history: historyResults,
        commitments: commitmentResults
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Testnet Faucet
  app.post("/api/faucet", (req, res) => {
    const amount = 0.1;
    const id = generateId();
    const timestamp = Date.now();

    try {
      const insertCommitment = db.prepare("INSERT INTO commitments (id, hash, amount, timestamp) VALUES (?, ?, ?, ?)");
      insertCommitment.run(id, `faucet_${generateId()}`, amount, timestamp);

      const insertHistory = db.prepare("INSERT INTO history (id, type, amount, timestamp, status) VALUES (?, ?, ?, ?, ?)");
      insertHistory.run(generateId(), 'faucet', amount.toFixed(4), 'Just now', 'confirmed');

      res.json({ success: true, amount });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
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
