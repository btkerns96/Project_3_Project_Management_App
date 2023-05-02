import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

const ThoughtForm = () => {
  const [thoughtTitle, setThoughtTitle] = useState('');
  const [thoughtText, setThoughtText] = useState('');

  const [image, setImage] = useState(null);


  const [characterCount, setCharacterCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought } }) {
      try {
        const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

        cache.writeQuery({
          query: QUERY_THOUGHTS,
          data: { thoughts: [addThought, ...thoughts] },
        });
      } catch (e) {
        console.error(e);
      }

      // update me object's cache
      const userData = cache.readQuery({ query: QUERY_ME });
      if (userData) {
        const { me } = userData;
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
        });
      }
    },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    if (!thoughtTitle || !thoughtText) {
      setErrorMessage('Please provide a title and description before submitting.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    try {
      const formData = new FormData(); // Create a new FormData object
      formData.append('thoughtText', thoughtText);

      if (image) {
        formData.append('image', image);
      }

      const { data } = await addThought({
        variables: {
          thoughtText,
          thoughtTitle,
          thoughtAuthor: Auth.getProfile().data.username,
        },
        // Pass the form data as the "input" variable to the mutation
        input: formData,
      });
      setThoughtText('');
      setThoughtTitle('');
      setImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'thoughtText' && value.length <= 280) {
      setThoughtText(value);
      setCharacterCount(value.length);
    }

    if (name === 'thoughtTitle') {
      setThoughtTitle(value);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  return (
    <div>
      <h3>Welcome To your Lost Projects</h3>
      <p>Welcome to the project planner app, an all-in-one solution for managing your projects from start to finish. Whether you're a freelancer, a small business owner, or a project manager in a large organization, this app will help you stay organized and on track.</p>
        <p>
        Features: Track progress: Keep track of the progress of your projects with the app's easy-to-use dashboard. Set reminders for yourself or your team members so that no task or deadline is missed. Add team members to your projects and assign tasks to them. 
        </p>
        <p>
          Benefits: Saves time and increases productivity, Improves communication and collaboration, and Increases accountability.
        </p>
      {Auth.loggedIn() ? (
        <>
          <p
            className={`m-0 ${
              characterCount === 280 || error ? 'text-danger' : ''
            }`}
          >
            {/* Character Count: {characterCount}/280 */}
          </p>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
            <textarea
                name="thoughtTitle"
                placeholder="Tell us the name of your project"
                value={thoughtTitle}
                className="form-input w-100"
                style={{ lineHeight: '1.5', resize: 'vertical' }}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="col-12 col-lg-9">
              <textarea
                name="thoughtText"
                placeholder="Tell us about your project"
                value={thoughtText}
                className="form-input w-100"
                style={{ lineHeight: '1.5', resize: 'vertical' }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-lg-9">
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
                Add Project
              </button>
            </div>
            {errorMessage && (
              <div className="col-12 my-3 bg-danger text-white p-3">
              {errorMessage}
            </div>
             )}
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error}
              </div>
            )}
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to add project. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default ThoughtForm;