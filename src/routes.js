// src/routes.js - the Evergreen quote routes (provided piece, Day 2).
// The GET routes are the team's original work. The POST handler was drafted
// with an AI assistant during a busy afternoon and reviewed on screen.
import { Quote } from "./Quote.js";
import { calculatePremium } from "./premium.js";

export function registerQuoteRoutes(app) {
  app.get("/api/quotes", async (req, res, next) => {
    try {
      const quotes = await Quote.find();
      res.json(quotes);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/quotes/:id", async (req, res, next) => {
    try {
      const quote = await Quote.findById(req.params.id);
      if (!quote) return res.status(404).json({ error: "Not found" });
      res.json(quote);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/quote", async (req, res, next) => {
    try {
      const { type, age, coverageAmount } = req.body;
      //const monthlyPremium = calculatePremium(type, Number(coverageAmount), Number(age));
      const monthlyPremium = calculatePremium(type, Number(age), Number(coverageAmount));
      const quote = await Quote.create({
        type,
        age: Number(age),
        coverageAmount: Number(coverageAmount),
        monthlyPremium,
      });
      res.status(201).json(quote);
    } catch (err) {
      next(err);
    }
  });
}
