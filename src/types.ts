/** The board's columns, in display order. A task's status is the key of its column. */
export const COLUMNS = [
    { key: "todo", title: "To Do" },
    { key: "progress", title: "In Progress" },
    { key: "done", title: "Done" },
] as const;

export type ColumnKey = (typeof COLUMNS)[number]["key"];

export interface Task {
    id: number;
    title: string;
    description: string;
    col: ColumnKey;
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
