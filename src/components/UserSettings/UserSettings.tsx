import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USERS } from '../../graphql/Queries';
import { UPDATE_USER } from '../../graphql/Mutations';
import { User } from './User';

const UserSettings = (): JSX.Element => {

  const { data, loading, error }  = useQuery(GET_USERS);
  const [ updateUserInfo ]  = useMutation<{updateUser: User}>(UPDATE_USER);

  const [ imageFile, setImageFile ] = useState<null | File>(null);
  const [ user, setUser ] = useState<User>({
    _id: '',
    name: '',
    email: '',
    bio: '',
    imageUrl: '',
    status: ''
  });

  useEffect(() => {
    setUser({
      _id: data?.getUsers[0]?._id,
      name: data?.getUsers[0]?.name,
      email: data?.getUsers[0]?.email,
      bio: data?.getUsers[0]?.bio,
      imageUrl: data?.getUsers[0]?.imageUrl,
      status: data?.getUsers[0]?.status
    })
  }, [data]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const stateKey = event.currentTarget.name;
    const newValue = event.currentTarget.value;
    setUser(prevState => ({
      ...prevState,
      [stateKey]: newValue
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const userDetails: User = {
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      status: user.status
    }
    if (imageFile) {
      const data = new FormData();
      data.append('file', imageFile);
      data.append('upload_preset', 'jfoqugj1');
      data.append('api_key', 'process.env.NODE_ENV.REACT_APP_CLOUDINARY_API_KEY');
      const res = await fetch (
        'https://api.cloudinary.com/v1_1/dpyiqv7ej/image/upload',
        {
          method: 'POST',
          body: data,
        }
      );
      const upload = await res.json();
      userDetails.imageUrl = upload.url;
    }
    updateUserInfo({
      variables: {
        userDetails: userDetails,
      }
    });
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files;
    if (file && file[0]) {
      setImageFile(file[0]);
    }
  };

  return (
    <div className="user-settings-container">

      <div>
        User Settings
      </div>

      <form
        className="form-user-settings"
        onSubmit={handleSubmit}
      >
        <div>
          <img src={user.imageUrl} alt="user_image" width="300"/>
        </div>
        <div>
          <h2>Upload New Profile Image</h2>
          <input
            name="file"
            type="file"
            placeholder="Upload a new profile image"
            onChange={uploadImage}
          />
        </div>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          placeholder={user.name}
          name="name"
          type="text"
          value={user.name}
          onChange={handleChange}
        >
        </input>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          placeholder={user.email}
          name="email"
          type="text"
          value={user.email}
          onChange={handleChange}
        >
        </input>

        <label htmlFor="bio">Bio</label>
        <input
          id="bio"
          placeholder={user.bio}
          name="bio"
          type="text"
          value={user.bio}
          onChange={handleChange}
        >
        </input>

        <label htmlFor="status">Status</label>
        <input
          id="status"
          placeholder={user.status}
          name="status"
          type="text"
          value={user.status}
          onChange={handleChange}
        >
        </input>

       <button
        type="submit"
       >
         Save Changes
       </button>

      </form>
    </div>
  )
};

export default UserSettings;