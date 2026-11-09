import type { Dispatch, SetStateAction } from "react";
import Button from "./ui/core/Button";
import Icon from "./ui/core/Icon";

interface GoalComposerProps {
    goal: string;
    setGoal: Dispatch<SetStateAction<string>>;
    onPlan: () => void;
    examples: string[];
}

function GoalComposer({ goal, setGoal, onPlan, examples }: GoalComposerProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-20 text-center">
            <h1 className="m-0 max-w-3xl text-[40px] md:text-[60px] font-normal tracking-(--tracking-display) leading-[1.13] text-(--text-strong)">
                Turn any goal into a plan, instantly.
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
                    variant="primary"
                    onClick={onPlan}
                    disabled={!goal.trim()}
                    iconRight={<Icon name="arrow-right" size={16} />}
                >
                    Plan it
                </Button>
            </div>

            <p className="text-[10px] font-medium uppercase tracking-(--tracking-label) text-(--text-muted)">
                This chat uses Claude Sonnet 4.6
            </p>

            {examples.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                    {examples.map((ex) => (
                        <button
                            key={ex}
                            onClick={() => setGoal(ex)}
                            className="cursor-pointer rounded-full border border-(--border-subtle) bg-(--surface-card) px-3.5 py-1.5 text-sm text-(--text-primary) transition duration-150 hover:border-(--border-default)"
                        >
                            {ex}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GoalComposer;
