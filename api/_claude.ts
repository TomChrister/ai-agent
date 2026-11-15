// Shared by both agents. The "_" prefix keeps Vercel from deploying this file as a route.
import Anthropic from "@anthropic-ai/sdk";
import type { VercelResponse } from "@vercel/node";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/** Public endpoints spend our API key: text input is capped at 1-500 characters before it reaches Claude. */
export const isText = (v: unknown) => typeof v === "string" && v.trim() !== "" && v.length <= 500;

/** Sends one prompt to Claude and replies with { result: <text> }, or a 500 on failure. */
export async function askClaude(res: VercelResponse, system: string, content: string) {
    try {
        const message = await client.messages.create({
            model: "claude-sonnet-4-6",
            temperature: 0.2,
            max_tokens: 1024,
            system,
            messages: [{ role: "user", content }]
        });

        const block = message.content[0];
        res.status(200).json({ result: block.type === "text" ? block.text : "" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}
