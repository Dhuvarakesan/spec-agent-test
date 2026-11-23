import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createTodo,
  deriveTodoCounts,
  toggleTodoStatus,
  updateTodo,
  updateTodoById,
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
  afterEach(() => {
    vi.useRealTimers();
  });

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
    expect(() => createTodo({ title: ' ' }))
      .toThrow('Enter a task title before saving');
  });

  it('updates provided fields while preserving omitted values', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-02T03:04:05.000Z'));

    const updatedTodo = updateTodo(existingTodo, {
      title: '  Publish release notes  ',
    });

    expect(updatedTodo).toMatchObject({
      ...existingTodo,
      title: 'Publish release notes',
      description: existingTodo.description,
    });
    expect(updatedTodo.createdAt).toBe(existingTodo.createdAt);
    expect(updatedTodo.updatedAt).toBe('2026-01-02T03:04:05.000Z');
  });

  it('updates a matching todo by id without creating a duplicate item', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-03T04:05:06.000Z'));

    const otherTodo: Todo = {
      ...existingTodo,
      id: 'todo-2',
      title: 'Keep original task',
    };
    const updatedTodos = updateTodoById(
      [existingTodo, otherTodo],
      existingTodo.id,
      {
        title: '  Publish release notes  ',
        description: '  Include screenshots.  ',
      },
    );

    expect(updatedTodos).toHaveLength(2);
    expect(updatedTodos.map((todo) => todo.id)).toEqual(['todo-1', 'todo-2']);
    expect(updatedTodos[0]).toMatchObject({
      ...existingTodo,
      title: 'Publish release notes',
      description: 'Include screenshots.',
      updatedAt: '2026-01-03T04:05:06.000Z',
    });
    expect(updatedTodos[1]).toBe(otherTodo);
  });

  it('toggles completion status and derives list counts', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-04T05:06:07.000Z'));

    const completedTodo = toggleTodoStatus(existingTodo);

    expect(completedTodo.completed).toBe(true);
    expect(completedTodo.createdAt).toBe(existingTodo.createdAt);
    expect(completedTodo.updatedAt).toBe('2026-01-04T05:06:07.000Z');
    expect(deriveTodoCounts([existingTodo, completedTodo])).toEqual({
      total: 2,
      completed: 1,
      pending: 1,
    });
  });
});
