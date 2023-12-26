// PrivateRoute.js (create a new file)
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './auth'; // Import the isAuthenticated function

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default PrivateRoute;
