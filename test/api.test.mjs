// test/api.test.mjs - the safety net for the Evergreen Quote API (provided).
// Runs against a throwaway database (evergreen-test), never your real data.
// NOTE: this suite imports src/routes.js, which you copy in on Day 2. Before
// then, `npm test` fails with "Cannot find module": that is expected.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import mongoose from "mongoose";
import { registerQuoteRoutes } from "../src/routes.js";
import { calculatePremium } from "../src/premium.js";
import { Quote } from "../src/Quote.js";

let server;
let base;

// The tests get their own database. TEST_MONGODB_URI can override it where
// the test database lives elsewhere; the default matches the lab VM and CI.
const TEST_URI =
  process.env.TEST_MONGODB_URI || "mongodb://127.0.0.1:27017/evergreen-test";

before(async () => {
  await mongoose.connect(TEST_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  await Quote.deleteMany({});
  const app = express();
  app.use(express.json());
  registerQuoteRoutes(app);
  app.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Server error" });
  });
  server = app.listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
});

test("GET /api/quotes returns a JSON array", async () => {
  const res = await fetch(`${base}/api/quotes`);
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(await res.json()));
});

test("GET /api/quotes/:id returns 404 for an unknown id", async () => {
  const res = await fetch(`${base}/api/quotes/no-such-quote`);
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: "Not found" });
});

test("POST /api/quote creates a quote and returns 201", async () => {
  const res = await fetch(`${base}/api/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "home", age: 52, coverageAmount: 250000 }),
  });
  assert.equal(res.status, 201);
  const quote = await res.json();
  assert.ok(quote._id, "the created quote has an id");
  assert.equal(quote.type, "home");
});

test("POST /api/quote computes the premium with the shared rate table", async () => {
  const res = await fetch(`${base}/api/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "auto", age: 35, coverageAmount: 50000 }),
  });
  assert.equal(res.status, 201);
  const quote = await res.json();
  // Rate-agnostic on purpose: whatever BASE_RATES says today, the API's answer
  // must match the shared premium math for the same inputs.
  assert.equal(quote.monthlyPremium, calculatePremium("auto", 35, 50000));
});

test("POST /api/quote rejects an age below 18 with a 400", async () => {
  const res = await fetch(`${base}/api/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "auto", age: 5, coverageAmount: 50000 }),
  });
  assert.equal(res.status, 400);
});

test("POST /api/quote rejects a coverage amount below 10000 with a 400", async () => {
  const res = await fetch(`${base}/api/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "home", age: 40, coverageAmount: 5000 }),
  });
  assert.equal(res.status, 400);
});

test("POST /api/quote rejects an unknown coverage type with a 400", async () => {
  const res = await fetch(`${base}/api/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "boat", age: 40, coverageAmount: 50000 }),
  });
  assert.equal(res.status, 400);
});
