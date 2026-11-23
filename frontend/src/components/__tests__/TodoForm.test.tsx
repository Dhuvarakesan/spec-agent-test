import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import TodoForm from '../TodoForm';

function renderTodoForm(onSubmit = vi.fn()) {
  render(
    <StrictMode>
      <TodoForm onSubmit={onSubmit} />
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
    expect(screen.getAllByText('Enter a task title before saving')).toHaveLength(2);
    expect(titleInput).toHaveAttribute('aria-invalid', 'true');
    expect(titleInput).toHaveFocus();
  });
});
