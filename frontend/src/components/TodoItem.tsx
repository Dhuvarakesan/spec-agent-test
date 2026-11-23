import type { Todo } from '../lib/todos';

interface TodoItemProps {
  todo: Todo;
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

export default function TodoItem({
  todo,
  onDeleteTodo,
  onEditTodo,
  onToggleTodoStatus,
}: TodoItemProps) {
  const description = todo.description.trim();
  const statusLabel = todo.completed ? 'Completed' : 'Pending';
  const toggleLabel = todo.completed ? 'Mark pending' : 'Mark complete';
  const hasTimestampMetadata = todo.createdAt !== '' || todo.updatedAt !== '';

  return (
    <article className="task-card">
      <div className="task-content">
        <div className="task-title-row">
          <h2>{todo.title}</h2>
          <span
            className={todo.completed ? 'tag tag-success' : 'tag tag-pending'}
          >
            {statusLabel}
          </span>
        </div>

        {description !== '' && (
          <p className="task-description">{description}</p>
        )}

        {hasTimestampMetadata && (
          <p className="task-meta">
            {todo.createdAt !== '' && (
              <>
                Created{' '}
                <time dateTime={todo.createdAt}>
                  {formatTodoDate(todo.createdAt)}
                </time>
              </>
            )}
            {todo.createdAt !== '' && todo.updatedAt !== '' && ' - '}
            {todo.updatedAt !== '' && (
              <>
                Updated{' '}
                <time dateTime={todo.updatedAt}>
                  {formatTodoDate(todo.updatedAt)}
                </time>
              </>
            )}
          </p>
        )}
      </div>

      <div className="task-actions">
        <button
          className="button button-secondary button-small"
          type="button"
          aria-label={`${toggleLabel} ${todo.title}`}
          onClick={() => onToggleTodoStatus(todo.id)}
        >
          {toggleLabel}
        </button>
        <button
          className="button button-secondary button-small"
          type="button"
          aria-label={`Edit ${todo.title}`}
          onClick={() => onEditTodo(todo.id)}
        >
          Edit
        </button>
        <button
          className="button button-danger button-small"
          type="button"
          aria-label={`Delete ${todo.title}`}
          onClick={() => onDeleteTodo(todo.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
