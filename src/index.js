// src/index.js - the Evergreen Quote API service shell.
// The health route, error handling, and startup below are the platform team's
// work and stay as-is. The quote routes and GraphQL are wired in on Day 2.
import express from "express";
import { connectDB } from "./db.js";
// INSERT: route import (Day 2 - paste the line from the kit README here)
// INSERT: GraphQL import (Day 2 - paste the line from the kit README here)

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// The health route: the first thing a load balancer, a Kubernetes probe, or a
// curious Delivery Lead asks. The service name comes from .env (Day 2 CONFIG).
app.get("/", (req, res) => {
  res.json({ message: process.env.SERVICE_NAME ?? "CHANGEME", status: "ok" });
});

// INSERT: register the quote routes (Day 2 - paste the line from the kit README here)

// INSERT: mount GraphQL (Day 2 - paste the line from the kit README here)

// The two handlers below must stay AFTER the routes: Express checks them in order.
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

await connectDB();
app.listen(PORT, () => {
  console.log(`${process.env.SERVICE_NAME ?? "CHANGEME"} on http://localhost:${PORT}`);
});
