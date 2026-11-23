import type { Todo } from '../lib/todos';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onCreateTask: () => void;
  onDeleteTodo: (todoId: string) => void;
  onEditTodo: (todoId: string) => void;
  onToggleTodoStatus: (todoId: string) => void;
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
          {todos.map((todo) => (
            <li className="task-list-item" key={todo.id}>
              <TodoItem
                todo={todo}
                onDeleteTodo={onDeleteTodo}
                onEditTodo={onEditTodo}
                onToggleTodoStatus={onToggleTodoStatus}
              />
            </li>
          ))}
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
