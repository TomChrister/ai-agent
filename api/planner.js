import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

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
            messages: [{ role: "user", content: `Goal: ${goal}` }]
        });

        res.status(200).json({ result: message.content[0].text });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}