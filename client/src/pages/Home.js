import React from 'react';
import { useQuery } from '@apollo/client';

import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';

import { QUERY_THOUGHTS } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  const thoughts = data?.thoughts || [];

  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md- mb-3 p-3"
          style={{ border: '4px solid #1a1a1a' }}
        >
          <ThoughtForm />
        </div>
        <div className="col-12 col-md-9 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Featured Projects!"
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
