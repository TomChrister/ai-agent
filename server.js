import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/api/planner", async (req, res) => {
    const { goal } = req.body;

    try {
        const message = await client.messages.create({
            model: "claude-sonnet-4-6",
            temperature: 0.2,
            max_tokens: 1024,
            system: `You are a Planner Agent. Your job is to break down a goal into concrete, 
            actionable subtasks that another AI agent (Worker) can solve one at a time.
            
            Rules:
            - Maximum 5 subtasks
            - Each task must be specific and self-contained (not dependent on context outside what's given)
            - Do not solve the tasks yourself, only plan them
            - Always respond in English, regardless of what language the goal is written in
            - Respond ONLY with valid JSON, no other text
            
            Format:
            {
            "goal": "short summary of the goal",
            "tasks": [
            { "id": 1, "title": "short title", "description": "what needs to be done" }
            ]
            }`,
            messages: [{ role: "user", content: `Mål: ${ goal }` }]
        });

        res.json({ result: message.content[0].text });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

app.post("/api/revise", async (req, res) => {
    const { goal, tasks, instruction } = req.body;

    try {
        const message = await client.messages.create({
            model: "claude-sonnet-4-6",
            temperature: 0.2,
            max_tokens: 1024,
            system: `You are a Revise Agent for an AI task planner. You are given the current goal,
            the current list of tasks, and an instruction describing a change the user wants
            (e.g. "add two more tasks about music", "focus more on the venue", "remove the budget task").

            Propose the minimal set of changes that satisfies the instruction.

            Rules:
            - Do not repeat unchanged tasks
            - "add" contains brand new tasks, no id: { "title": "short title", "description": "what needs to be done" }
            - "update" contains changes to existing tasks, matched by id: { "id": <number>, "title": "...", "description": "..." } — include only the fields that changed, id is required
            - "remove" is a list of existing task ids to delete: [<number>, ...]
            - Only use ids that are present in the given task list for "update" and "remove"
            - Keep the same tone and specificity as the existing tasks
            - Respond ONLY with valid JSON, no other text

            Format:
            {
            "add": [ { "title": "short title", "description": "what needs to be done" } ],
            "update": [ { "id": 1, "title": "short title", "description": "what needs to be done" } ],
            "remove": [3]
            }`,
            messages: [{
                role: "user",
                content: `Goal: ${goal}\n\nCurrent tasks:\n${JSON.stringify(tasks, null, 2)}\n\nInstruction: ${instruction}`
            }]
        });

        res.json({ result: message.content[0].text });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

app.listen(3000, () => console.log("Server started on port 3000"));