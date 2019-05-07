import * as React from "react";

// import { renderRoutes } from 'react-router-config';
import Loadable from "react-loadable";
import "./App.scss";

import { HashRouter, Switch, Route, BrowserRouter } from "react-router-dom";
const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

// Containers
const AdminDashboardScreen = Loadable( {
  loader: () =>
    import( "../src/screen/views/AdminDashboadScreen/AdminDashboardScreen" ),
  loading
} );

const Login = Loadable( {
  loader: () => import( "../src/screen/views/LoginScreen/LoginScreen" ),
  loading
} );

const Error = Loadable( {
  loader: () => import( "../src/screen/views/ErrorScreen/ErrorScreen" ),
  loading
} );

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path={ "/" } name="Home" component={ AdminDashboardScreen } />
          <Route exact path={ "/login" } component={ Login } />
          <Route component={ Error } />
        </Switch>
      </BrowserRouter>
    );
  }
}
