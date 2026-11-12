# Decision Memo: Leave the Bad Test Quote in Place Until Thursday's Reset

**Date:** Monday (Day 2)
**Author:** Marc
**Decision area:** Day 2 data-quality tradeoff

## Context

This morning's demo created a quote before the engineering fix was applied, and it was saved with a premium of $0.35 a month on $50,000 of coverage. The defect is now fixed, but that wrong record is still in the database next to the six genuine quotes. Cleaning it up competed with finishing the day's assembly.

## Options considered

1. **Delete it by hand now.** Pros: the database looks clean immediately. Cons: manual data edits leave no record of what changed, they set a habit I don't want the team to copy, and they cost time for a record that only exists in a test system.
2. **Reset the whole database now.** Pros: guaranteed return to the six known quotes. Cons: it also wipes the quotes I made to prove the new name and sponsor rates work, so those checks would need redoing.
3. **Leave it, log it, and reset on Thursday as already planned.** Pros: no time lost, and today's checks stay intact. Cons: anyone who looks at the data before Thursday sees a wrong number.

## Recommendation

Option 3, with one rule: if anyone outside the team is about to see the data, I reset it first. The record is logged in the risk register (R5) so it is not forgotten.

## Why

No customer or partner can see this data, so nobody is harmed by it. Today's job is a working service. Spending the morning cleaning test data would trade real progress for a cosmetic fix, while naming the problem out loud keeps the risk managed.

## What would change my mind

If the sponsor or a partner is scheduled to see the data before Thursday, or the $0.35 quote shows up in a demo, I reset the database the same day.