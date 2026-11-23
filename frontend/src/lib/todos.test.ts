import { describe, expect, it } from 'vitest';

import {
  createTodo,
  deriveTodoCounts,
  toggleTodoStatus,
  updateTodo,
  validateTodoTitle,
  type Todo,
} from './todos';

const existingTodo: Todo = {
  id: 'todo-1',
  title: 'Draft release notes',
  description: 'Summarize recent work.',
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('todo helpers', () => {
  it('validates titles after trimming whitespace', () => {
    expect(validateTodoTitle(' Add tests ')).toBe(true);
    expect(validateTodoTitle('   ')).toBe(false);
  });

  it('creates a todo with normalized draft values', () => {
    const todo = createTodo({
      title: '  Write the first todo  ',
      description: '  Keep it local-first.  ',
    });

    expect(todo).toMatchObject({
      title: 'Write the first todo',
      description: 'Keep it local-first.',
      completed: false,
    });
    expect(todo.id).toEqual(expect.any(String));
    expect(Date.parse(todo.createdAt)).not.toBeNaN();
    expect(todo.updatedAt).toBe(todo.createdAt);
  });

  it('rejects empty todo titles', () => {
    expect(() => createTodo({ title: ' ' })).toThrow('Todo title is required.');
  });

  it('updates provided fields while preserving omitted values', () => {
    const updatedTodo = updateTodo(existingTodo, {
      title: '  Publish release notes  ',
    });

    expect(updatedTodo).toMatchObject({
      ...existingTodo,
      title: 'Publish release notes',
      description: existingTodo.description,
    });
    expect(updatedTodo.updatedAt).not.toBe(existingTodo.updatedAt);
  });

  it('toggles completion status and derives list counts', () => {
    const completedTodo = toggleTodoStatus(existingTodo);

    expect(completedTodo.completed).toBe(true);
    expect(completedTodo.updatedAt).not.toBe(existingTodo.updatedAt);
    expect(deriveTodoCounts([existingTodo, completedTodo])).toEqual({
      total: 2,
      completed: 1,
      pending: 1,
    });
  });
});
