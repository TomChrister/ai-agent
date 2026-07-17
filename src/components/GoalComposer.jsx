import Button from "./ui/core/Button";
import Icon from "./ui/core/Icon";

function GoalComposer({ goal, setGoal, onPlan, loading, examples = [] }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-20 text-center">
            <h1 className="m-0 max-w-2xl text-4xl md:text-5xl font-bold tracking-tight leading-tight text-(--text-primary)">
                Turn any goal into a <span className='text-(--accent-primary)'>plan,</span> instantly.
            </h1>
            <p className="max-w-md text-lg text-(--text-secondary)">
                Describe what you want to achieve — our AI Planner breaks it into tasks on a kanban board.
            </p>

            <div className="flex w-full max-w-xl gap-2 rounded-full border border-(--border-default) bg-(--surface-card) p-2 pl-6 shadow-(--shadow-s)">
                <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. a birthday party, wedding, confirmation…"
                    className="flex-1 border-none bg-transparent text-base text-(--text-primary) outline-none"
                />
                <Button
                    className='cursor-pointer'
                    variant="primary"
                    onClick={onPlan}
                    disabled={loading}
                    iconRight={!loading && <Icon name="arrow-right" size={16} className="invert brightness-200" />}
                >
                    {loading ? "Planning…" : "Plan it"}
                </Button>
            </div>

            <p className="text-sm text-gray-600">
                This chat uses Claude Sonnet 4.6
            </p>

            {examples.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                    {examples.map((ex) => (
                        <button
                            key={ex}
                            onClick={() => setGoal(ex)}
                            className="cursor-pointer rounded-full border border-(--border-subtle) bg-(--surface-sunken) px-3.5 py-1.5 text-sm font-medium text-(--text-secondary) hover:bg-(--border-subtle)"
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
