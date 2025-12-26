import React from 'react';
import './usercard.css';

function UserCardComp({ name = 'This is test', avatar, onSave }) {
  return (
    <div className="user-card">
      <img
        src={
          avatar ||
          'https://cdn.britannica.com/25/197725-050-4D55A6E9/Christmas-tree.jpg'
        }
        alt={`${name} avatar`}
        className="user-card__avatar"
      />

      <div className="user-card__info">
        <h3 className="user-card__name">{name}</h3>
        <div className="user-card__meta">Sample subtitle</div>
      </div>

      <div className="user-card__actions">
        <button className="btn-primary" onClick={onSave} type="button">
          Save
        </button>
      </div>
    </div>
  );
}

export default UserCardComp;
