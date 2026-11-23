import { useState } from 'react';

import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import {
  createTodo,
  deriveTodoCounts,
  toggleTodoStatusById,
  updateTodoById,
  type Todo,
  type TodoDraft,
} from './lib/todos';

type ShellScreen = 'dashboard' | 'form' | 'tasks' | 'storage';

interface ShellNavigationItem {
  screen: ShellScreen;
  label: string;
}

const navigationItems: ShellNavigationItem[] = [
  { screen: 'dashboard', label: 'Dashboard' },
  { screen: 'form', label: 'Task form' },
  { screen: 'tasks', label: 'Task list' },
  { screen: 'storage', label: 'Local storage' },
];

const sampleTodos: Todo[] = [
  createTodo({
    title: 'Capture the first todo',
    description: 'Use the shared todo helpers as the domain foundation.',
  }),
  {
    ...createTodo({
      title: 'Review saved tasks',
      description: 'Confirm local-first behavior once storage is implemented.',
    }),
    completed: true,
  },
];

function DashboardScreen({ todos }: { todos: Todo[] }) {
  const todoCounts = deriveTodoCounts(todos);

  return (
    <div className="screen-stack">
      <section className="card" aria-labelledby="dashboard-title">
        <p className="eyebrow">Today</p>
        <h1 id="dashboard-title">Dashboard counts</h1>
        <p className="lede">
          A compact overview for the todo workspace, ready for live data in a
          later task.
        </p>
      </section>

      <section className="stat-grid" aria-label="Todo counts">
        <article className="stat-card">
          <span className="stat-value">{todoCounts.total}</span>
          <span className="stat-label">Total</span>
        </article>
        <article className="stat-card">
          <span className="stat-value">{todoCounts.pending}</span>
          <span className="stat-label">Pending</span>
        </article>
        <article className="stat-card">
          <span className="stat-value">{todoCounts.completed}</span>
          <span className="stat-label">Completed</span>
        </article>
      </section>
    </div>
  );
}

interface TaskFormScreenProps {
  selectedTodo?: Todo;
  onCancelEdit: () => void;
  onSubmitTodo: (draft: TodoDraft) => void;
}

function TaskFormScreen({
  selectedTodo,
  onCancelEdit,
  onSubmitTodo,
}: TaskFormScreenProps) {
  const formKey = selectedTodo?.id ?? 'create-todo';
  const modeLabel = selectedTodo ? 'Edit' : 'Create';

  return (
    <section className="card" aria-labelledby="task-form-title">
      <p className="eyebrow">{modeLabel}</p>
      <h1 id="task-form-title">Task form</h1>

      <TodoForm
        key={formKey}
        todo={selectedTodo}
        onCancelEdit={onCancelEdit}
        onSubmit={onSubmitTodo}
      />
    </section>
  );
}

function StorageScreen() {
  return (
    <section className="card" aria-labelledby="storage-title">
      <p className="eyebrow">Browser</p>
      <h1 id="storage-title">Local storage labels</h1>
      <p className="lede">
        These labels reserve the storage status area without adding persistence
        behavior ahead of its spec.
      </p>
      <dl className="storage-list">
        <div>
          <dt>Storage key</dt>
          <dd>simple-todo.tasks</dd>
        </div>
        <div>
          <dt>Sync model</dt>
          <dd>Local only</dd>
        </div>
        <div>
          <dt>Network</dt>
          <dd>No backend configured</dd>
        </div>
      </dl>
    </section>
  );
}

function getScreenTitle(screen: ShellScreen): string {
  return (
    navigationItems.find((item) => item.screen === screen)?.label
    ?? 'Dashboard'
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ShellScreen>('dashboard');
  const [editedTodoId, setEditedTodoId] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);
  const selectedTodo = todos.find((todo) => todo.id === editedTodoId);

  function handleCancelEdit() {
    setEditedTodoId(null);
  }

  function handleEditTodo(todoId: string) {
    setEditedTodoId(todoId);
    setActiveScreen('form');
  }

  function handleCreateTask() {
    setEditedTodoId(null);
    setActiveScreen('form');
  }

  function handleDeleteTodo(todoId: string) {
    const todoToDelete = todos.find((todo) => todo.id === todoId);

    if (!todoToDelete) {
      return;
    }

    const shouldDelete = window.confirm(`Delete "${todoToDelete.title}"?`);

    if (!shouldDelete) {
      return;
    }

    setTodos((currentTodos) => (
      currentTodos.filter((todo) => todo.id !== todoId)
    ));

    if (editedTodoId === todoId) {
      setEditedTodoId(null);
    }
  }

  function handleToggleTodoStatus(todoId: string) {
    setTodos((currentTodos) => (
      toggleTodoStatusById(currentTodos, todoId)
    ));
  }

  function handleSetActiveScreen(screen: ShellScreen) {
    if (screen !== 'form') {
      setEditedTodoId(null);
    }

    setActiveScreen(screen);
  }

  function handleSubmitTodo(draft: TodoDraft) {
    if (editedTodoId) {
      setTodos((currentTodos) => (
        updateTodoById(currentTodos, editedTodoId, draft)
      ));
      setEditedTodoId(null);
      return;
    }

    setTodos((currentTodos) => [createTodo(draft), ...currentTodos]);
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="topbar">
        <a className="brand" href="/" aria-label="Simple Todo home">
          <span className="brand-mark" aria-hidden="true">
            T
          </span>
          <span className="brand-text">Simple Todo</span>
        </a>
        <span className="topbar-label">Client-only workspace</span>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="Application sections">
          <nav className="shell-nav" aria-label="Screens">
            {navigationItems.map((item) => (
              <button
                className={
                  item.screen === activeScreen
                    ? 'nav-button nav-button-active'
                    : 'nav-button'
                }
                key={item.screen}
                type="button"
                aria-current={item.screen === activeScreen ? 'page' : undefined}
                onClick={() => handleSetActiveScreen(item.screen)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main
          className="content"
          id="main-content"
          tabIndex={-1}
          aria-label={getScreenTitle(activeScreen)}
        >
          {activeScreen === 'dashboard' && <DashboardScreen todos={todos} />}
          {activeScreen === 'form' && (
            <TaskFormScreen
              selectedTodo={selectedTodo}
              onCancelEdit={handleCancelEdit}
              onSubmitTodo={handleSubmitTodo}
            />
          )}
          {activeScreen === 'tasks' && (
            <TodoList
              todos={todos}
              onCreateTask={handleCreateTask}
              onDeleteTodo={handleDeleteTodo}
              onEditTodo={handleEditTodo}
              onToggleTodoStatus={handleToggleTodoStatus}
            />
          )}
          {activeScreen === 'storage' && <StorageScreen />}
        </main>
      </div>
    </div>
  );
}
