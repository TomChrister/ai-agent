import { useState } from "react";

function App() {
    const [goal, setGoal] = useState("");
    const [result, setResult] = useState("");

    async function handleClick() {
        const res = await fetch("http://localhost:3000/api/planner", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ goal })
        });
        const data = await res.json();
        setResult(data.result);
    }

    return (
        <div>
            <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What do you want to plan? e.g. a birthday party, wedding, confirmation..."
                className="border px-3 py-2 rounded-lg w-full"
            />
            <button onClick={handleClick} className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Plan it
            </button>
            <pre>{result}</pre>
        </div>
    );
}

export default App;