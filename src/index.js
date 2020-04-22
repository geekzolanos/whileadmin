/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import config from "config/firebase";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { FirebaseAppProvider } from "reactfire";

// core components
import Admin from "layouts/Admin.js";

import "assets/css/material-dashboard-react.css?v=1.8.0";
import Login from "views/Login";

const hist = createBrowserHistory();

ReactDOM.render(
  <FirebaseAppProvider firebaseConfig={config}>
    <Suspense fallback={<h1>Please wait...</h1>}>
      <Router history={hist}>
        <Switch>
          <Route path="/admin" component={Admin} />
          <Route path="/login" component={Login} />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </Router>
    </Suspense>
  </FirebaseAppProvider>,
  document.getElementById("root")
);
