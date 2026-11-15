/** Parses an agent's response text as JSON, tolerating markdown code fences. Throws SyntaxError on non-JSON. */
export function parseReply(rawText: string) {
    const fenced = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    return JSON.parse(fenced ? fenced[1] : rawText);
}
