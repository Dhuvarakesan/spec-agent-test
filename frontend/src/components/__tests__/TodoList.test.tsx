import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import TodoList from '../TodoList';
import type { Todo } from '../../lib/todos';

const sampleTodos: Todo[] = [
  {
    id: 'todo-1',
    title: 'Plan release',
    description: 'Confirm launch notes and owners.',
    completed: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'todo-2',
    title: 'Send recap',
    description: '',
    completed: true,
    createdAt: '2026-01-03T00:00:00.000Z',
    updatedAt: '2026-01-03T00:00:00.000Z',
  },
];

function renderTodoList({
  onCreateTask = vi.fn(),
  onDeleteTodo = vi.fn(),
  onEditTodo = vi.fn(),
  onToggleTodoStatus = vi.fn(),
  todos = sampleTodos,
}: {
  onCreateTask?: () => void;
  onDeleteTodo?: (todoId: string) => void;
  onEditTodo?: (todoId: string) => void;
  onToggleTodoStatus?: (todoId: string) => void;
  todos?: Todo[];
} = {}) {
  render(
    <StrictMode>
      <TodoList
        todos={todos}
        onCreateTask={onCreateTask}
        onDeleteTodo={onDeleteTodo}
        onEditTodo={onEditTodo}
        onToggleTodoStatus={onToggleTodoStatus}
      />
    </StrictMode>,
  );

  return {
    onCreateTask,
    onDeleteTodo,
    onEditTodo,
    onToggleTodoStatus,
  };
}

describe('TodoList', () => {
  it('renders the empty state and create action when there are no todos', async () => {
    const user = userEvent.setup();
    const { onCreateTask } = renderTodoList({ todos: [] });

    expect(screen.getByRole('heading', { name: 'Task list' }))
      .toBeInTheDocument();
    expect(screen.getByText('0 items')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'No tasks available' }))
      .toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Saved tasks' })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Create task' }));

    expect(onCreateTask).toHaveBeenCalledTimes(1);
  });

  it('renders saved todo cards with counts, descriptions, and actions', () => {
    renderTodoList();

    expect(screen.getByText('2 items')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Saved tasks' }))
      .toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Plan release' }))
      .toBeInTheDocument();
    expect(screen.getByText('Confirm launch notes and owners.'))
      .toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Send recap' }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mark complete Plan release' }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mark pending Send recap' }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit Plan release' }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete Send recap' }))
      .toBeInTheDocument();
  });
});
