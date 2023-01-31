import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


function AdminRoute({ isLoggedIn, isAdmin, component: Component, location, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoggedIn) {
            if(!isAdmin){
                return <Redirect to={{ pathname: "/", state: { from: location } }} />;
            }
          return <Component {...props} />;
        } else {
          return <Redirect to={{ pathname: "/login", state: { from: location } }} />;
        }
      }}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    isAdmin: state.user.isAdmin,
  };
};

export default connect(mapStateToProps)(AdminRoute);
