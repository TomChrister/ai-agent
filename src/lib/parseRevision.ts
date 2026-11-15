import type { Revision } from "../types";
import { parseReply } from "./parseReply";

const text = (v: unknown) => (typeof v === "string" && v.trim() ? v : undefined);
const toIds = (v: unknown) => (Array.isArray(v) ? v.map(Number).filter(Number.isInteger) : []);
const list = (v: unknown): Record<string, unknown>[] =>
    Array.isArray(v) ? v.filter((x) => x && typeof x === "object") : [];

/** Parses the Revise Agent's response text into an { add, update, remove } diff, tolerating markdown code fences. */
export function parseRevision(rawText: string): Revision {
    const parsed = parseReply(rawText) ?? {};

    // Keep only known fields with the right types: model output is untrusted.
    return {
        add: list(parsed.add)
            .filter((t) => text(t.title))
            .map((t) => ({ title: text(t.title)!, description: text(t.description) ?? "" })),
        update: list(parsed.update)
            .map((u) => ({ id: Number(u.id), title: text(u.title), description: text(u.description) }))
            .filter((u) => Number.isInteger(u.id)),
        remove: toIds(parsed.remove),
    };
}
