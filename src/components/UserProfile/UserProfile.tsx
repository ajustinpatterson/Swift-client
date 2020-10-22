import React from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { GET_USERS } from '../../graphql/Queries';
import './UserProfile.scss';
export default function UserProfile(): JSX.Element {
  const { data, loading, error } = useQuery(GET_USERS);
  const history = useHistory();
  const handleClick = () => {
    history.push('/usersettings');
  };
  return (
    <div className="container">
      <div className="title">Hello, {data?.getUsers[0]?.name}</div>
      <div className="user-info">
        <div className="profile-pic">
          <img src={data?.getUsers[0]?.imageUrl} />
        </div>
        <div className="details">
          <div>Name: {data?.getUsers[0]?.name}</div>
          <div>Email: {data?.getUsers[0]?.email}</div>
          <div>{data?.getUsers[0]?.bio}</div>
          <div>{data?.getUsers[0]?.status}</div>
          <button className="btn" onClick={handleClick}>
            Edit profile
          </button>
        </div>
      </div>
    </div>
  );
}