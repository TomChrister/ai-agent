import { describe, it, expect } from "vitest";
import { parsePlan } from "./parsePlan";
import { parseRevision } from "./parseRevision";
import { applyRevision } from "./applyRevision";
import type { Task } from "../types";

describe("parsePlan", () => {
    it("reads a fenced reply, drops untitled tasks and numbers ids itself", () => {
        const raw = '```json\n{"tasks":[{"id":"7","title":"A","description":"a"},{"title":""},{"id":7,"title":"B"}]}\n```';
        expect(parsePlan(raw)).toEqual([
            { id: 1, title: "A", description: "a", col: "todo" },
            { id: 2, title: "B", description: "", col: "todo" },
        ]);
    });

    it("throws on non-JSON or a reply without tasks", () => {
        expect(() => parsePlan("Sure! Here is your plan")).toThrow(SyntaxError);
        expect(() => parsePlan("null")).toThrow("no tasks array");
        expect(() => parsePlan('{"tasks":[{"title":" "}]}')).toThrow("no tasks");
    });
});

describe("parseRevision + applyRevision", () => {
    const tasks: Task[] = [
        { id: 1, title: "Venue", description: "Book it", col: "done" },
        { id: 3, title: "Budget", description: "Set it", col: "todo" },
        { id: 4, title: "Food", description: "Order it", col: "progress" },
    ];

    it("applies add, update and remove, keeping untouched columns", () => {
        const revision = parseRevision(
            JSON.stringify({
                add: [{ title: "Music", description: "Hire a DJ" }, { description: "no title" }],
                update: [{ id: 1, title: "Big venue", col: "todo" }, { id: 4, title: null }],
                remove: ["3"],
            })
        );

        expect(applyRevision(tasks, revision)).toEqual([
            { id: 1, title: "Big venue", description: "Book it", col: "done" },
            { id: 4, title: "Food", description: "Order it", col: "progress" },
            { id: 5, title: "Music", description: "Hire a DJ", col: "todo" },
        ]);
    });

    it("treats missing keys as no change", () => {
        expect(parseRevision("{}")).toEqual({ add: [], update: [], remove: [] });
    });
});
