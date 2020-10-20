import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Landing from '../Landing/Landing';
import App from '../../containers/App/App';
import Meeting from '../../containers/Meeting/Meeting';
import PowderRoom from '../PowderRoom/PowderRoom';
import UserProfile from '../UserProfile/UserProfile';
import UserSettings from '../UserSettings/UserSettings';


export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/powderroom" component={PowderRoom} />
      <Route path="/meeting" component={Meeting} />
      <Route path="/main" component={App} />
      <Route path="/userprofile" component={UserProfile} />
      <Route path="/usersettings" component={UserSettings} />
    </Switch>
  );
}
