import React from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { GET_USERS } from '../../graphql/Queries';

export default function UserProfile (): JSX.Element {

  const { data, loading, error }  = useQuery(GET_USERS);
  const history = useHistory();

  const handleClick = () => {
    history.push('/usersettings');
  };

  return (
    <div>

      <div>
        Hello {data?.getUsers[0]?.name}
      </div>

      <div>
        <div>
          <img src={data?.getUsers[0]?.imageUrl} width="500"/>
        </div>

        <div>
          {data?.getUsers[0]?.name}
        </div>

        <div>
        {data?.getUsers[0]?.email}
        </div>

        <div>
        {data?.getUsers[0]?.bio}
        </div>

        <div>
          {data?.getUsers[0]?.status}
        </div>

        <button onClick={handleClick}>
          Edit profile
        </button>

      </div>

    </div>
  )
};

