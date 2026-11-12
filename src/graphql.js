// src/graphql.js - GraphQL over the same quote data (provided piece, Day 2).
// One endpoint, client-chosen fields. The explorer lives at /explorer because
// the health route owns / in this service.
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import { Quote } from "./Quote.js";
import { calculatePremium } from "./premium.js";

const schema = buildSchema(`
  type Quote {
    id: ID!
    type: String!
    age: Int!
    coverageAmount: Int!
    monthlyPremium: Float!
    tags: [String!]!
  }

  type Query {
    quotes: [Quote!]!
    quote(id: ID!): Quote
  }

  type Mutation {
    createQuote(type: String!, age: Int!, coverageAmount: Int!): Quote!
  }
`);

function toGraphQL(quote) {
  return {
    id: quote._id,
    type: quote.type,
    age: quote.age,
    coverageAmount: quote.coverageAmount,
    monthlyPremium: quote.monthlyPremium,
    tags: quote.tags,
  };
}

const root = {
  quotes: async () => (await Quote.find()).map(toGraphQL),

  quote: async ({ id }) => {
    const quote = await Quote.findById(id);
    return quote ? toGraphQL(quote) : null;
  },

  createQuote: async ({ type, age, coverageAmount }) => {
    const monthlyPremium = calculatePremium(type, age, coverageAmount);
    const quote = await Quote.create({ type, age, coverageAmount, monthlyPremium });
    return toGraphQL(quote);
  },
};

export function mountGraphQL(app) {
  app.all("/graphql", createHandler({ schema, rootValue: root }));

  app.get("/explorer", (req, res) => {
    res.type("html").end(ruruHTML({ endpoint: "/graphql" }));
  });
}
