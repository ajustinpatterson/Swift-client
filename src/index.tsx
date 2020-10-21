import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import { ApolloProvider } from '@apollo/client';
import * as serviceWorker from './serviceWorker';
import userClient from './graphql/Client';
import { SocketContext } from './socket-context';

ReactDOM.render(
  <ApolloProvider client={userClient}>
    <SocketContext.Consumer>
      {(socket: any) => <App socket={socket} />}
    </SocketContext.Consumer>
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
