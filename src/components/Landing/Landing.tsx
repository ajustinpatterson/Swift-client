import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import logo from '../../assets/swift-logo-big.png';
import './Landing.scss';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../../graphql/Mutations';

const apiId =
  '770694473973-nsm7s39sp1tvm3jpg6d3pk7ln309gvbr.apps.googleusercontent.com';

const Landing = (): JSX.Element => {
  // const [userName, setUserName] = useState<String>('');
  // const [createUser, newUser] = useMutation(CREATE_USER);
  const history = useHistory();
  const active = localStorage.getItem('loggedIn');
  const [roomId, setRoomId] = useState<string>('');


  const handleClick = () => {
    history.push('/powderroom');
  };

  const roomSubmit = (event: any) => {
    event.preventDefault();

    setRoomId('');
    history.push('/powderroom');
  };

  const handleChange = (event: any) => {
    setRoomId(event.target.value);
  };

  const responseGoogle = async (response: any) => {
    try {
      console.log(response);
      console.log(response.profileObj.email)
      if (response) {
        setUserName(response.profileObj.name);
        createUser({
          variables: {
            userDetails: {
              email: response.profileObj.email,
              familyName: response.profileObj.familyName,
              givenName: response.profileObj.givenName,
              googleId: response.profileObj.googleId,
              imageUrl: response.profileObj.imageUrl,
              name: response.profileObj.name,
            }
          },
        });

      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="landing">
      <img src={logo} alt="Logo" className="logo" />
      <div className="hero-stack">
        <h1>Fast video meetings made simple.</h1>
        <p>Meet Swift. Fast calls. Simple.</p>
        <div className="spacer"></div>
        {!active ? (
          <div className="btn-stack">
            <GoogleLogin
              clientId={apiId}
              render={(renderProps) => (
                <button
                  className="button"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  Login
                </button>
              )}
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        ) : (
          <div className="btn-stack">
            <button className="button" onClick={handleClick}>
              New
            </button>
            <form autoComplete="off" onSubmit={roomSubmit}>
              <label>
                <input
                  type="text"
                  value={roomId}
                  onChange={handleChange}
                  placeholder="Enter Room"
                />
              </label>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;

