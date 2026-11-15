import type { Dispatch, SetStateAction } from "react";
import Button from "./ui/core/Button";
import Icon from "./ui/core/Icon";

const EXAMPLES = ["A birthday party", "A bachelor party", "A work partner meeting", "A weekend trip"];

interface GoalComposerProps {
    goal: string;
    setGoal: Dispatch<SetStateAction<string>>;
    onPlan: () => void;
}

function GoalComposer({ goal, setGoal, onPlan }: GoalComposerProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-20 text-center">
            <h1 className="m-0 max-w-3xl text-[40px] md:text-[64px] font-light tracking-(--tracking-display) leading-[1.15] text-(--text-strong)">
                Turn any goal into a plan,{" "}
                <span className="bg-(image:--gradient-apricot) bg-clip-text font-normal text-transparent">instantly.</span>
            </h1>
            <p className="max-w-md text-base text-(--text-secondary)">
                Describe what you want to achieve — our AI Planner breaks it into tasks on a kanban board.
            </p>

            <div className="flex w-full max-w-xl gap-2 rounded-full border border-(--border-subtle) bg-(--surface-card) p-2 pl-6 shadow-(--shadow-sm)">
                <input
                    type="text"
                    value={goal}
                    maxLength={500}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. a birthday party, wedding, confirmation…"
                    className="flex-1 border-none bg-transparent text-base text-(--text-primary) outline-none"
                />
                <Button
                    variant="dark"
                    onClick={onPlan}
                    disabled={!goal.trim()}
                    // Icons are black <img>s: invert to white on the dark button.
                    iconRight={<Icon name="arrow-right" size={16} className="brightness-0 invert" />}
                >
                    Plan it
                </Button>
            </div>

            <p className="text-xs font-medium uppercase tracking-(--tracking-label) text-(--text-muted)">
                This chat uses Claude Sonnet 4.6
            </p>

            <div className="flex flex-wrap justify-center gap-2">
                {EXAMPLES.map((ex) => (
                    <button
                        key={ex}
                        onClick={() => setGoal(ex)}
                        className="cursor-pointer rounded-full border border-(--border-subtle) bg-(--surface-card) px-3.5 py-1.5 text-sm text-(--text-primary) transition duration-150 hover:border-(--border-default)"
                    >
                        {ex}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default GoalComposer;
