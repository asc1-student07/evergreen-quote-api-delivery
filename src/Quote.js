// src/Quote.js - the Mongoose model: the database contract (provided).
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

// Quote ids are readable strings ("q1".."q6" for the seeded quotes, UUIDs for
// new ones) so they stay easy to curl and easy to talk about in a review.
const quoteSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    type: { type: String, required: true, enum: ["auto", "home", "life"] },
    age: { type: Number, required: true, min: 18, max: 100 },
    coverageAmount: { type: Number, required: true, min: 10000 },
    monthlyPremium: { type: Number, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Quote = mongoose.model("Quote", quoteSchema);
