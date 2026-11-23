import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import App from './App';

function renderApp() {
  return render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

describe('App shell', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the todo shell with dashboard counts by default', () => {
    renderApp();

    expect(
      screen.getByRole('link', { name: 'Simple Todo home' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Screens' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Dashboard counts' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('navigates between shell screens', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(screen.getByRole('button', { name: 'Task list' }));
    expect(
      screen.getByRole('heading', { name: 'Task list' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Capture the first todo')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Task form' }));
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Save task' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Local storage' }));
    expect(
      screen.getByRole('heading', { name: 'Local storage labels' }),
    ).toBeInTheDocument();
    expect(screen.getByText('simple-todo.tasks')).toBeInTheDocument();
  });

  it('creates a pending task and displays its description', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(screen.getByRole('button', { name: 'Task form' }));
    await user.type(screen.getByLabelText('Title'), 'Prepare demo');
    await user.type(
      screen.getByLabelText(/Description/),
      'Show the created pending task.',
    );
    await user.click(screen.getByRole('button', { name: 'Save task' }));

    expect(screen.getByLabelText('Title')).toHaveValue('');
    expect(screen.getByLabelText(/Description/)).toHaveValue('');

    await user.click(screen.getByRole('button', { name: 'Task list' }));

    expect(screen.getByRole('heading', { name: 'Prepare demo' }))
      .toBeInTheDocument();
    expect(screen.getByText('Show the created pending task.'))
      .toBeInTheDocument();
    expect(screen.getAllByText('Pending')).toHaveLength(2);
  });

  it('toggles todo status from the task list', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(screen.getByRole('button', { name: 'Task list' }));
    await user.click(
      screen.getByRole('button', {
        name: 'Mark complete Capture the first todo',
      }),
    );

    expect(
      screen.getByRole('button', {
        name: 'Mark pending Capture the first todo',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Completed')).toHaveLength(2);
  });

  it('hands edit actions off to the form with selected todo values', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(screen.getByRole('button', { name: 'Task list' }));
    await user.click(
      screen.getByRole('button', { name: 'Edit Review saved tasks' }),
    );

    expect(screen.getByRole('heading', { name: 'Task form' }))
      .toBeInTheDocument();
    expect(screen.getByText('Edit todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveValue('Review saved tasks');
    expect(screen.getByLabelText(/Description/)).toHaveValue(
      'Confirm local-first behavior once storage is implemented.',
    );
    expect(screen.getByRole('button', { name: 'Update task' }))
      .toBeInTheDocument();
  });

  it('keeps a todo when delete confirmation is canceled', async () => {
    const user = userEvent.setup();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderApp();

    await user.click(screen.getByRole('button', { name: 'Task list' }));
    await user.click(
      screen.getByRole('button', { name: 'Delete Capture the first todo' }),
    );

    expect(confirm).toHaveBeenCalledWith('Delete "Capture the first todo"?');
    expect(screen.getByRole('heading', { name: 'Capture the first todo' }))
      .toBeInTheDocument();
    expect(screen.getByText('2 items')).toBeInTheDocument();
  });

  it('confirms deletion and shows the empty state after the final todo', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderApp();

    await user.click(screen.getByRole('button', { name: 'Task list' }));
    await user.click(
      screen.getByRole('button', { name: 'Delete Capture the first todo' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Delete Review saved tasks' }),
    );

    expect(screen.getByText('0 items')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'No tasks available' }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create task' }))
      .toBeInTheDocument();
  });
});
