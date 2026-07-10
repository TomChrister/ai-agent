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
            max_tokens: 1024,
            temperature: 0.2,
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

app.listen(3000, () => console.log("Server started on port 3000"));