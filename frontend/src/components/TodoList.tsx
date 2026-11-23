import type { Todo } from '../lib/todos';

interface TodoListProps {
  todos: Todo[];
  onCreateTask: () => void;
  onDeleteTodo: (todoId: string) => void;
  onEditTodo: (todoId: string) => void;
  onToggleTodoStatus: (todoId: string) => void;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatTodoDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export default function TodoList({
  todos,
  onCreateTask,
  onDeleteTodo,
  onEditTodo,
  onToggleTodoStatus,
}: TodoListProps) {
  const taskCountLabel = (
    `${todos.length} ${todos.length === 1 ? 'item' : 'items'}`
  );

  return (
    <section className="card" aria-labelledby="task-list-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Browse</p>
          <h1 id="task-list-title">Task list</h1>
          <p className="lede">
            Review your saved tasks, update status, or jump back to the form to
            capture the next todo.
          </p>
        </div>
        <span className="tag">{taskCountLabel}</span>
      </div>

      {todos.length > 0 ? (
        <ul className="task-list" aria-live="polite" aria-label="Saved tasks">
          {todos.map((todo) => {
            const statusLabel = todo.completed ? 'Completed' : 'Pending';

            return (
              <li className="task-list-item" key={todo.id}>
                <article className="task-card">
                  <div className="task-content">
                    <div className="task-title-row">
                      <h2>{todo.title}</h2>
                      <span
                        className={
                          todo.completed
                            ? 'tag tag-success'
                            : 'tag tag-pending'
                        }
                      >
                        {statusLabel}
                      </span>
                    </div>
                    <p className="task-description">
                      {todo.description || 'No description added.'}
                    </p>
                    <p className="task-meta">
                      Created{' '}
                      <time dateTime={todo.createdAt}>
                        {formatTodoDate(todo.createdAt)}
                      </time>
                      {' - '}
                      Updated{' '}
                      <time dateTime={todo.updatedAt}>
                        {formatTodoDate(todo.updatedAt)}
                      </time>
                    </p>
                  </div>

                  <div className="task-actions">
                    <button
                      className="button button-secondary button-small"
                      type="button"
                      onClick={() => onToggleTodoStatus(todo.id)}
                    >
                      {todo.completed ? 'Mark pending' : 'Mark complete'}
                    </button>
                    <button
                      className="button button-secondary button-small"
                      type="button"
                      onClick={() => onEditTodo(todo.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="button button-danger button-small"
                      type="button"
                      onClick={() => onDeleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="empty-state">
          <h2>No tasks available</h2>
          <p>
            Create your first task to start tracking titles, descriptions, and
            completion status.
          </p>
          <button
            className="button button-primary"
            type="button"
            onClick={onCreateTask}
          >
            Create task
          </button>
        </div>
      )}
    </section>
  );
}
