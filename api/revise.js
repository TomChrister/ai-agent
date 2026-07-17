import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

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

        res.status(200).json({ result: message.content[0].text });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}