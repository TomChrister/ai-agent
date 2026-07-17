/** Parses the Revise Agent's response text into an { add, update, remove } diff, tolerating markdown code fences. */
export function parseRevision(rawText) {
    const fenced = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonText = fenced ? fenced[1] : rawText;
    const parsed = JSON.parse(jsonText);

    return {
        add: Array.isArray(parsed.add) ? parsed.add : [],
        update: Array.isArray(parsed.update) ? parsed.update : [],
        remove: Array.isArray(parsed.remove) ? parsed.remove : [],
    };
}
