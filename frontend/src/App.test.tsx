import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { describe, expect, it } from 'vitest';

import App from './App';

function renderApp() {
  return render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

describe('App shell', () => {
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
});
