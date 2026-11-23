import { useId, useState, type FormEvent } from 'react';

import {
  TODO_TITLE_REQUIRED_MESSAGE,
  validateTodoTitle,
  type TodoDraft,
} from '../lib/todos';

interface TodoFormProps {
  onSubmit: (draft: TodoDraft) => void;
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const descriptionId = useId();
  const errorId = useId();
  const helperId = useId();
  const titleId = useId();
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateTodoTitle(title)) {
      setTitleError(TODO_TITLE_REQUIRED_MESSAGE);
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
        <span className="tag">Create todo</span>
        <p className="form-helper" id={helperId}>
          Add a required title and an optional description.
        </p>
      </div>

      <label className="form-field" htmlFor={titleId}>
        <span>Title</span>
        <input
          aria-describedby={titleError ? errorId : helperId}
          aria-invalid={titleError ? 'true' : 'false'}
          id={titleId}
          name="title"
          placeholder="Plan the next useful step"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);

            if (titleError) {
              setTitleError('');
            }
          }}
        />
      </label>

      <label className="form-field" htmlFor={descriptionId}>
        <span>
          Description <span className="optional-label">Optional</span>
        </span>
        <textarea
          id={descriptionId}
          name="description"
          placeholder="Add a short note"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <div className="validation-panel" aria-live="polite">
        {titleError ? (
          <p className="validation-message" id={errorId}>
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
          Save task
        </button>
      </div>
    </form>
  );
}
