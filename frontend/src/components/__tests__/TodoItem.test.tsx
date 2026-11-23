import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import TodoItem from '../TodoItem';
import type { Todo } from '../../lib/todos';

const pendingTodo: Todo = {
  id: 'todo-1',
  title: 'Write test cases',
  description: 'Cover the list and item actions.',
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

const completedTodo: Todo = {
  ...pendingTodo,
  id: 'todo-2',
  title: 'Review implementation',
  description: '',
  completed: true,
};

function renderTodoItem({
  onDeleteTodo = vi.fn(),
  onEditTodo = vi.fn(),
  onToggleTodoStatus = vi.fn(),
  todo = pendingTodo,
}: {
  onDeleteTodo?: (todoId: string) => void;
  onEditTodo?: (todoId: string) => void;
  onToggleTodoStatus?: (todoId: string) => void;
  todo?: Todo;
} = {}) {
  render(
    <StrictMode>
      <TodoItem
        todo={todo}
        onDeleteTodo={onDeleteTodo}
        onEditTodo={onEditTodo}
        onToggleTodoStatus={onToggleTodoStatus}
      />
    </StrictMode>,
  );

  return {
    onDeleteTodo,
    onEditTodo,
    onToggleTodoStatus,
  };
}

describe('TodoItem', () => {
  it('renders title, description, status, metadata, and action buttons', () => {
    renderTodoItem();

    const article = screen.getByRole('article');

    expect(within(article).getByRole('heading', { name: 'Write test cases' }))
      .toBeInTheDocument();
    expect(within(article).getByText('Cover the list and item actions.'))
      .toBeInTheDocument();
    expect(within(article).getByText('Pending')).toBeInTheDocument();
    expect(within(article).getByText(/Created/)).toBeInTheDocument();
    expect(
      within(article).getByRole('button', {
        name: 'Mark complete Write test cases',
      }),
    ).toBeInTheDocument();
    expect(
      within(article).getByRole('button', { name: 'Edit Write test cases' }),
    )
      .toBeInTheDocument();
    expect(
      within(article).getByRole('button', { name: 'Delete Write test cases' }),
    ).toBeInTheDocument();
  });

  it('omits a blank description and shows completed actions', () => {
    renderTodoItem({ todo: completedTodo });

    expect(screen.getByRole('heading', { name: 'Review implementation' }))
      .toBeInTheDocument();
    expect(screen.queryByText('Cover the list and item actions.')).toBeNull();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Mark pending Review implementation',
      }),
    ).toBeInTheDocument();
  });

  it('hands off toggle, edit, and delete actions with the todo id', async () => {
    const user = userEvent.setup();
    const { onDeleteTodo, onEditTodo, onToggleTodoStatus } = renderTodoItem();

    await user.click(
      screen.getByRole('button', { name: 'Mark complete Write test cases' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Edit Write test cases' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Delete Write test cases' }),
    );

    expect(onToggleTodoStatus).toHaveBeenCalledTimes(1);
    expect(onToggleTodoStatus).toHaveBeenCalledWith('todo-1');
    expect(onEditTodo).toHaveBeenCalledTimes(1);
    expect(onEditTodo).toHaveBeenCalledWith('todo-1');
    expect(onDeleteTodo).toHaveBeenCalledTimes(1);
    expect(onDeleteTodo).toHaveBeenCalledWith('todo-1');
  });
});
