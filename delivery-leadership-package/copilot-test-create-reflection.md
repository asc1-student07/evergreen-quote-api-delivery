# Copilot Test Build Reflection: Evergreen Quote
**Date:** Day 3
**Author:** Marc
**Tool / mode:** GitHub Copilot in VS Code, Agent mode

## What I asked Copilot

I gave Copilot the seven existing test cases (name, request, expected result, why it matters) and asked it to follow the same pattern for an 8th: a `POST /api/quote` with `coverageAmount` missing should return `400`. I also asked it to summarize its changes before editing the file, and to mock an `npm test` run.

## The prompt (verbatim)

~~~text
in api.test.mjs, automated tests are defined for the following 7 cases:

## 1. List quotes returns a JSON array
- **Test name:** `GET /api/quotes returns a JSON array`
- **Request:** `GET /api/quotes`
- **Expect:** status `200`, body is an array
- **Why it matters:** the list endpoint is alive and returns the right shape

## 2. Unknown quote id returns 404
- **Test name:** `GET /api/quotes/:id returns 404 for an unknown id`
- **Request:** `GET /api/quotes/no-such-quote`
- **Expect:** status `404`, body `{ "error": "Not found" }`
- **Why it matters:** missing records fail cleanly, not with a crash or an HTML error page

## 3. Create a quote returns 201
- **Test name:** `POST /api/quote creates a quote and returns 201`
- **Request:** `POST /api/quote` with `{ "type": "home", "age": 52, "coverageAmount": 250000 }`
- **Expect:** status `201`, body has an `_id`, and `type` is `"home"`
- **Why it matters:** the happy path for creating a quote works end to end

## 4. Premium is computed with the shared rate table
- **Test name:** `POST /api/quote computes the premium with the shared rate table`
- **Request:** `POST /api/quote` with `{ "type": "auto", "age": 35, "coverageAmount": 50000 }`
- **Expect:** status `201`, and `monthlyPremium` equals `calculatePremium("auto", 35, 50000)`
- **Why it matters:** catches the AI-drafted bug (arguments passed in the wrong order, giving `0.35` instead of `400`). It is rate-agnostic, so it still passes after the sponsor's rate change.
- **Day 2 note:** this is the one test that fails until you apply the kit's one-line fix in `src/routes.js`

## 5. Age below 18 is rejected
- **Test name:** `POST /api/quote rejects an age below 18 with a 400`
- **Request:** `POST /api/quote` with `{ "type": "auto", "age": 5, "coverageAmount": 50000 }`
- **Expect:** status `400`
- **Why it matters:** the Mongoose schema enforces `age >= 18`

## 6. Coverage below 10,000 is rejected
- **Test name:** `POST /api/quote rejects a coverage amount below 10000 with a 400`
- **Request:** `POST /api/quote` with `{ "type": "home", "age": 40, "coverageAmount": 5000 }`
- **Expect:** status `400`
- **Why it matters:** the schema enforces `coverageAmount >= 10000`

## 7. Unknown coverage type is rejected
- **Test name:** `POST /api/quote rejects an unknown coverage type with a 400`
- **Request:** `POST /api/quote` with `{ "type": "boat", "age": 40, "coverageAmount": 50000 }`
- **Expect:** status `400`
- **Why it matters:** the schema only allows `auto`, `home`, or `life`

In the same pattern, create an 8th test that is a POST to /api/quote with a missing field (no coverageAmount) and returns 400.

Before updating the file, summarize the changes to me.  If it's possible, also mock a "npm test" run.
~~~

**Why I wrote it this way:** I gave Copilot the full list of existing tests so it would match the file's conventions, named the exact missing field and expected status so there was nothing to guess, and asked for a summary first so I could review the plan before any file changed.

## What Copilot produced

**Copilot's summary (verbatim):**

~~~text
Added an 8th API test in api.test.mjs:
POST /api/quote rejects a missing coverage amount with a 400
Request body: { "type": "home", "age": 40 }
Expected result: HTTP status 400
This matches the existing validation-test pattern already used for invalid age, invalid coverageAmount, and invalid type.

I ran the equivalent test command in the workspace:
npm test -- --test-reporter=spec
Result: 8 tests passed, 0 failed
Current status: The suite is green with the new missing-field case included.
~~~

**The test code it added (appended to `test/api.test.mjs`):**

```js
test("POST /api/quote rejects a missing coverage amount with a 400", async () => {
  const res = await fetch(`${base}/api/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "home", age: 40 }),
  });
  assert.equal(res.status, 400);
});
```

**What I checked about the code:** it follows the same pattern as the existing validation tests (5 to 7). The body is valid except for the missing `coverageAmount`, so only one thing can cause the 400. It asserts only the status code. I confirmed with `git diff --stat` (showing only what has change since last commit) and `git diff test/api.test.mjs` (showing what lines changed in that file) that Copilot changed only the test file; it did not touch any production code.

## What the pipeline said

- Copilot's own reported run: 8 passed, 0 failed
- **My** run of `npm test` (the one that counts): _8 tests, _8_ pass, _0_ fail_
- Copilot's report matched my run? yes

## My critique

_Roughly 100 words. What did Copilot get right? What did it get wrong? Would I ship it as-is?_

Copilot got the structure right: it followed the existing pattern, sent a body with no `coverageAmount`, and asserted a 400, taking the suite from seven tests to eight, all green. It also summarized its change before editing, as asked, and left production code alone. What it did not do is explain why the API returns 400. The route has no explicit check; the missing field becomes `NaN` and the Mongoose schema rejects it, so the test re-checks the database contract, like tests 5 to 7. It asserts only the status code, not that the error names `coverageAmount`. 

## What checks Copilot's output?

The same safety net that caught Tuesday's AI-drafted route defect (a premium of `0.35` instead of `400`) just checked today's AI-drafted test. The chain is:

1. **`npm test` locally:** run after every assembly step, not just before merge.
2. **CI on the pull request:** the same tests run against a throwaway database from the lock file.
3. **My go/no-go call:** made from the CI result, not from how the demo looks.

The gap is that the tests only check what someone thought to test. Copilot's claim that "8 tests passed" is a report, not proof; the proof is my own run and the CI run. A person still has to read the AI's output and ask whether it passes for the right reason.

## Decision

☐ Keep as-is   x Keep with changes   ☐ Delete

Was a simple ask to review and validate.

## What I'd do differently next time

- N/A
