// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useMutation } from '@apollo/client';

// import { ADD_THOUGHT } from '../../utils/mutations';
// import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

// import Auth from '../../utils/auth';

// const ThoughtForm = () => {
//   const [thoughtText, setThoughtText] = useState('');

//   const [characterCount, setCharacterCount] = useState(0);

//   const [addThought, { error }] = useMutation(ADD_THOUGHT, {
//     update(cache, { data: { addThought } }) {
//       try {
//         const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

//         cache.writeQuery({
//           query: QUERY_THOUGHTS,
//           data: { thoughts: [addThought, ...thoughts] },
//         });
//       } catch (e) {
//         console.error(e);
//       }

//       // update me object's cache
//       const { me } = cache.readQuery({ query: QUERY_ME });
//       cache.writeQuery({
//         query: QUERY_ME,
//         data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
//       });
//     },
//   });

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const { data } = await addThought({
//         variables: {
//           thoughtText,
//           thoughtAuthor: Auth.getProfile().data.username,
//         },
//       });

//       setThoughtText('');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     if (name === 'thoughtText' && value.length <= 280) {
//       setThoughtText(value);
//       setCharacterCount(value.length);
//     }
//   }



//   return (
//     <div>
//       <h3>List of Your Projects</h3>
//       {Auth.loggedIn() ? (
//         <>
//           <p
//             className={`m-0 ${
//               characterCount === 280 || error ? 'text-danger' : ''
//             }`}
//           >
//             Character Count: {characterCount}/280
//           </p>
//           <form
//             className="flex-row justify-center justify-space-between-md align-center"
//             onSubmit={handleFormSubmit}
//           >
//               <div className="col-12 col-lg-9">
//               <textarea
//                 name="thoughtText"
//                 placeholder="Project Title"
//                // value={thoughtTitle}
//                 className="form-input w-100"
//                 style={{ lineHeight: '1.5', resize: 'vertical' }}
//                 onChange={handleChange}
//               ></textarea>
//             </div>

//             <div className="col-12 col-lg-9">
//               <textarea
//                 name="thoughtText"
//                 placeholder="Tell us about your project..."
//                 value={thoughtText}
//                 className="form-input w-100"
//                 style={{ lineHeight: '1.5', resize: 'vertical' }}
//                 onChange={handleChange}
//               ></textarea>
//             </div>

//             <div className="col-12 col-lg-3">
//               <button className="btn btn-primary btn-block py-3" type="submit">
//                 Add Project
//               </button>
//             </div>
//             {error && (
//               <div className="col-12 my-3 bg-danger text-white p-3">
//                 {error.message}
//               </div>
//             )}
//           </form>
//         </>
//       ) : (
//         <p>
//           {/* You need to be logged in to share your thoughts. Please{' '} */}
//           <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
//         </p>
//       )}
//     </div>
//   );
// };

// export default ThoughtForm;



import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

const ThoughtForm = () => {
  const [thoughtTitle, setThoughtTitle] = useState('');
  const [thoughtText, setThoughtText] = useState('');

  const [image, setImage] = useState(null); // Add state for image


  const [characterCount, setCharacterCount] = useState(0);

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

    if (!thoughtTitle) {
      console.error('Please provide a thought title before submitting.');
      return;
    }

    try {
      const formData = new FormData(); // Create a new FormData object
      formData.append('thoughtText', thoughtText); // Add the text input to the form data

      if (image) {
        formData.append('image', image); // Add the image to the form data
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
      <h3>Post a Project!</h3>
      {Auth.loggedIn() ? (
        <>
          <p
            className={`m-0 ${
              characterCount === 280 || error ? 'text-danger' : ''
            }`}
          >
            Character Count: {characterCount}/280
          </p>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
              <input
                type="text"
                name="thoughtTitle"
                placeholder="Tell us the name of your project..."
                value={thoughtTitle}
                className="form-input w-100"
                onChange={handleChange}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
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
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error}
              </div>
            )}
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to add a project. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default ThoughtForm;