import { useId, useRef, useState, type FormEvent } from 'react';

import {
  TODO_TITLE_REQUIRED_MESSAGE,
  validateTodoTitle,
  type Todo,
  type TodoDraft,
} from '../lib/todos';

interface TodoFormProps {
  todo?: Todo;
  onCancelEdit?: () => void;
  onSubmit: (draft: TodoDraft) => void;
}

export default function TodoForm({
  todo,
  onCancelEdit,
  onSubmit,
}: TodoFormProps) {
  const descriptionId = useId();
  const errorId = useId();
  const helperId = useId();
  const titleId = useId();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const isEditing = todo !== undefined;
  const [description, setDescription] = useState(todo?.description ?? '');
  const [title, setTitle] = useState(todo?.title ?? '');
  const [titleError, setTitleError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateTodoTitle(title)) {
      setTitleError(TODO_TITLE_REQUIRED_MESSAGE);
      titleInputRef.current?.focus();
      return;
    }

    onSubmit({
      title,
      description,
    });
    setTitle('');
    setDescription('');
    setTitleError('');
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-header">
        <span className="tag">{isEditing ? 'Edit todo' : 'Create todo'}</span>
        <p className="form-helper" id={helperId}>
          {isEditing
            ? 'Update the selected task title or description.'
            : 'Add a required title and an optional description.'}
        </p>
      </div>

      <div className="form-field">
        <label htmlFor={titleId}>Title</label>
        <input
          aria-describedby={titleError ? errorId : helperId}
          aria-invalid={titleError ? 'true' : 'false'}
          id={titleId}
          name="title"
          placeholder="Plan the next useful step"
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);

            if (titleError) {
              setTitleError('');
            }
          }}
        />
        {titleError ? (
          <span className="field-error" id={errorId}>
            {titleError}
          </span>
        ) : null}
      </div>

      <div className="form-field">
        <label htmlFor={descriptionId}>
          Description <span className="optional-label">Optional</span>
        </label>
        <textarea
          id={descriptionId}
          name="description"
          placeholder="Add a short note"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="validation-panel" aria-live="polite">
        {titleError ? (
          <p className="validation-message validation-message-error">
            {titleError}
          </p>
        ) : (
          <p className="validation-message">
            Ready to save when the title is filled in.
          </p>
        )}
      </div>

      <div className="form-actions">
        <button className="button button-primary" type="submit">
          {isEditing ? 'Update task' : 'Save task'}
        </button>
        {isEditing ? (
          <button
            className="button button-secondary"
            type="button"
            onClick={onCancelEdit}
          >
            Cancel edit
          </button>
        ) : null}
      </div>
    </form>
  );
}
