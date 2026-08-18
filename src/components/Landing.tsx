import type { Dispatch, SetStateAction } from "react";
import type { ColumnKey, Revision, Task, TaskUpdate } from "../types";
import TopBar from "./TopBar";
import GoalComposer from "./GoalComposer";
import PlanningLoader from "./PlanningLoader";
import Board from "./Board";
import TaskDetailPanel from "./TaskDetailPanel";
import Toast from "./ui/overlays/Toast";

interface LandingProps {
    goal: string;
    setGoal: Dispatch<SetStateAction<string>>;
    onPlan: () => void;
    loading: boolean;
    tasks: Task[] | null;
    onMoveTask: (id: number, col: ColumnKey) => void;
    active: Task | null;
    setActive: Dispatch<SetStateAction<Task | null>>;
    error: string | null;
    onReset: () => void;
    onAddTask: (title: string, description: string) => void;
    onEditTask: (id: number, updates: Omit<TaskUpdate, "id">) => void;
    onDeleteTask: (id: number) => void;
    onRevise: (instruction: string) => void;
    revising: boolean;
    revisionsUsed: number;
    revisionsMax: number;
    pendingRevision: Revision | null;
    onApplyRevision: () => void;
    onDiscardRevision: () => void;
}

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
}: LandingProps) {
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
                    onMoveTask={onMoveTask}
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
