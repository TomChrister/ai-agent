import TopBar from "./TopBar";
import GoalComposer from "./GoalComposer";
import PlanningLoader from "./PlanningLoader";
import Board from "./Board";
import TaskDetailPanel from "./TaskDetailPanel";
import Toast from "./ui/overlays/Toast";

function Landing({
    goal,
    setGoal,
    onPlan,
    loading,
    tasks,
    onMoveTask,
    active,
    setActive,
    error,
    onReset,
    onAddTask,
    onEditTask,
    onDeleteTask,
    onRevise,
    revising,
    revisionsUsed,
    revisionsMax,
    pendingRevision,
    onApplyRevision,
    onDiscardRevision,
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <TopBar />

            {loading ? (
                <PlanningLoader />
            ) : !tasks ? (
                <GoalComposer
                    goal={goal}
                    setGoal={setGoal}
                    onPlan={onPlan}
                    loading={loading}
                    examples={["A birthday party", "A bachelor party", "A work partner meeting"]}
                />
            ) : (
                <Board
                    goal={goal}
                    tasks={tasks}
                    onCardClick={setActive}
                    onReset={onReset}
                    onAddTask={onAddTask}
                    onRevise={onRevise}
                    revising={revising}
                    revisionsUsed={revisionsUsed}
                    revisionsMax={revisionsMax}
                    pendingRevision={pendingRevision}
                    onApplyRevision={onApplyRevision}
                    onDiscardRevision={onDiscardRevision}
                />
            )}

            <TaskDetailPanel
                key={active?.id}
                task={active}
                onClose={() => setActive(null)}
                onMove={onMoveTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
            />

            {error && <Toast tone="error">{error}</Toast>}
        </div>
    );
}

export default Landing;
