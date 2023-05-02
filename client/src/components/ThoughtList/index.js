import React from 'react';
import { Link } from 'react-router-dom';

const ThoughtList = ({
  thoughts,
  title,
  showTitle = true,
  showUsername = true,
  onDeleteThought,
}) => {
  if (!thoughts.length) {
    return <h3>No Projects</h3>;
  }

  const renderDescription = (description) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g; // regular expression to detect URLs
    return description.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank">${url}</a>`; // wrap the URL in an anchor tag
    });
  };

  return (
    <div>
      {showTitle && <h3>{title}</h3>}
      {thoughts &&
        thoughts.map((thought) => (
          <div key={thought._id} className="card mb-3">
            <h4 className="card-header bg-primary text-light p-2 m-0">
              {showUsername ? (
                <Link
                  className="text-light"
                  to={`/thoughts/${thought._id}`}
                >
                  {thought.thoughtTitle} <br />
                  <span style={{ fontSize: '1rem' }}>
                    This project was posted on {thought.createdAt}
                  </span>
                </Link>
              ) : (
                <>
                  <span style={{ fontSize: '1rem' }}>
                    You had this project posted on {thought.createdAt}
                  </span>
                </>
              )}
            </h4>
            <div
              className="card-body bg-light p-2"
              dangerouslySetInnerHTML={{
                __html: renderDescription(thought.thoughtText),
              }}
            />
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDeleteThought(thought._id)}
              >
                Delete
              </button>
            </div>
            <Link
              className="btn btn-primary btn-block btn-squared"
              to={`/thoughts/${thought._id}`}
            >
              Review and Comment
            </Link>
          </div>
        ))}
    </div>
  );
};

export default ThoughtList;
