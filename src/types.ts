export type ColumnKey = "todo" | "progress" | "done";

export interface Subtask {
    label: string;
    done: boolean;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    col: ColumnKey;
    subtasks?: Subtask[];
}

/** A task as proposed by the Planner/Revise Agent, before an id/col is assigned. */
export interface TaskDraft {
    title: string;
    description: string;
}

export interface TaskUpdate {
    id: number;
    title?: string;
    description?: string;
}

export interface Plan {
    goal: string;
    tasks: Task[];
    revisionCount: number;
}

export interface Revision {
    add: TaskDraft[];
    update: TaskUpdate[];
    remove: number[];
}
