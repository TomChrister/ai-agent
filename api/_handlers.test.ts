import { describe, it, expect } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import planner from "./planner";
import revise from "./revise";

// Records the status a handler sends; these cases must be rejected before any Claude call.
async function statusOf(handler: typeof planner, body: unknown) {
    let status = 0;
    const res = { status: (s: number) => ((status = s), res), json: () => res } as unknown as VercelResponse;
    await handler({ method: "POST", body } as VercelRequest, res);
    return status;
}

describe("API input caps", () => {
    it("planner rejects an empty or over-long goal", async () => {
        expect(await statusOf(planner, { goal: " " })).toBe(400);
        expect(await statusOf(planner, { goal: "x".repeat(501) })).toBe(400);
    });

    it("revise rejects too many tasks or a missing instruction", async () => {
        const tasks = Array.from({ length: 21 }, (_, i) => ({ id: i, title: "t" }));
        expect(await statusOf(revise, { goal: "g", instruction: "i", tasks })).toBe(400);
        expect(await statusOf(revise, { goal: "g", tasks: [] })).toBe(400);
    });
});
