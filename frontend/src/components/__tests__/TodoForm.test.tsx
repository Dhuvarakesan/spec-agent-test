import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import TodoForm from '../TodoForm';
import type { Todo } from '../../lib/todos';

const editableTodo: Todo = {
  id: 'todo-1',
  title: 'Review invoices',
  description: 'Confirm the paid column before filing.',
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

function renderTodoForm({
  onCancelEdit,
  onSubmit = vi.fn(),
  todo,
}: {
  onCancelEdit?: () => void;
  onSubmit?: (draft: { title: string; description?: string }) => void;
  todo?: Todo;
} = {}) {
  render(
    <StrictMode>
      <TodoForm
        todo={todo}
        onCancelEdit={onCancelEdit}
        onSubmit={onSubmit}
      />
    </StrictMode>,
  );

  return onSubmit;
}

describe('TodoForm', () => {
  it('submits a non-empty title and clears the form', async () => {
    const user = userEvent.setup();
    const onSubmit = renderTodoForm();

    await user.type(screen.getByLabelText('Title'), '  Draft roadmap  ');
    await user.click(screen.getByRole('button', { name: 'Save task' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: '  Draft roadmap  ',
      description: '',
    });
    expect(screen.getByLabelText('Title')).toHaveValue('');
    expect(screen.getByLabelText(/Description/)).toHaveValue('');
  });

  it('includes the optional description on submit', async () => {
    const user = userEvent.setup();
    const onSubmit = renderTodoForm();

    await user.type(screen.getByLabelText('Title'), 'Prepare demo');
    await user.type(
      screen.getByLabelText(/Description/),
      'Show the created pending task.',
    );
    await user.click(screen.getByRole('button', { name: 'Save task' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Prepare demo',
      description: 'Show the created pending task.',
    });
  });

  it('shows validation instead of submitting an empty title', async () => {
    const user = userEvent.setup();
    const onSubmit = renderTodoForm();
    const titleInput = screen.getByLabelText('Title');

    await user.click(screen.getByRole('button', { name: 'Save task' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getAllByText('Enter a task title before saving'))
      .toHaveLength(2);
    expect(titleInput).toHaveAttribute('aria-invalid', 'true');
    expect(titleInput).toHaveFocus();
  });

  it('keeps whitespace-only drafts in place without submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = renderTodoForm();
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText(/Description/);

    await user.type(titleInput, '   ');
    await user.type(
      descriptionInput,
      'Notes should stay until the user fixes the title.',
    );
    await user.click(screen.getByRole('button', { name: 'Save task' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(titleInput).toHaveValue('   ');
    expect(descriptionInput).toHaveValue(
      'Notes should stay until the user fixes the title.',
    );
    expect(screen.getAllByText('Enter a task title before saving'))
      .toHaveLength(2);
  });

  it('populates edit mode and submits updated values', async () => {
    const user = userEvent.setup();
    const onSubmit = renderTodoForm({ todo: editableTodo });
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText(/Description/);

    expect(screen.getByText('Edit todo')).toBeInTheDocument();
    expect(titleInput).toHaveValue('Review invoices');
    expect(descriptionInput).toHaveValue(
      'Confirm the paid column before filing.',
    );

    await user.clear(titleInput);
    await user.type(titleInput, 'Review vendor invoices');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Attach the approval note.');
    await user.click(screen.getByRole('button', { name: 'Update task' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Review vendor invoices',
      description: 'Attach the approval note.',
    });
    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
  });

  it('calls cancel edit without submitting the populated todo', async () => {
    const user = userEvent.setup();
    const onCancelEdit = vi.fn();
    const onSubmit = renderTodoForm({ onCancelEdit, todo: editableTodo });

    await user.click(screen.getByRole('button', { name: 'Cancel edit' }));

    expect(onCancelEdit).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Title')).toHaveValue('Review invoices');
  });

  it('uses semantic labels and toggles aria-invalid with validation state', async () => {
    const user = userEvent.setup();
    renderTodoForm();
    const titleInput = screen.getByRole('textbox', { name: 'Title' });
    const descriptionInput = screen.getByRole('textbox', {
      name: /Description Optional/,
    });

    expect(titleInput).toHaveAccessibleName('Title');
    expect(descriptionInput).toHaveAccessibleName('Description Optional');
    expect(titleInput).toHaveAttribute('aria-invalid', 'false');

    await user.click(screen.getByRole('button', { name: 'Save task' }));
    expect(titleInput).toHaveAttribute('aria-invalid', 'true');

    await user.type(titleInput, 'Accessible task');
    expect(titleInput).toHaveAttribute('aria-invalid', 'false');
  });
});
