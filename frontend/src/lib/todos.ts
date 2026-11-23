export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoDraft {
  title: string;
  description?: string;
}

export interface TodoCounts {
  total: number;
  completed: number;
  pending: number;
}

export const TODO_TITLE_REQUIRED_MESSAGE = 'Todo title is required.';

export function createTodoId(): string {
  if (
    typeof crypto !== 'undefined'
    && typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  const timestamp = Date.now().toString(36);
  const randomSegment = Math.random().toString(36).slice(2, 10);

  return `todo-${timestamp}-${randomSegment}`;
}

export function validateTodoTitle(title: string): boolean {
  return title.trim().length > 0;
}

export function createTodo(draft: TodoDraft): Todo {
  const title = draft.title.trim();

  if (!validateTodoTitle(title)) {
    throw new Error(TODO_TITLE_REQUIRED_MESSAGE);
  }

  const now = new Date().toISOString();

  return {
    id: createTodoId(),
    title,
    description: draft.description?.trim() ?? '',
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateTodo(todo: Todo, draft: Partial<TodoDraft>): Todo {
  const title = draft.title === undefined ? todo.title : draft.title.trim();

  if (!validateTodoTitle(title)) {
    throw new Error(TODO_TITLE_REQUIRED_MESSAGE);
  }

  return {
    ...todo,
    title,
    description: draft.description === undefined
      ? todo.description
      : draft.description.trim(),
    updatedAt: new Date().toISOString(),
  };
}

export function toggleTodoStatus(todo: Todo): Todo {
  return {
    ...todo,
    completed: !todo.completed,
    updatedAt: new Date().toISOString(),
  };
}

export function deriveTodoCounts(todos: Todo[]): TodoCounts {
  const completed = todos.filter((todo) => todo.completed).length;
  const total = todos.length;

  return {
    total,
    completed,
    pending: total - completed,
  };
}
