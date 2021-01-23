import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) return <Redirect to="/feed" />;
  return (
    <div className="landing container">
      <header>
        <span>Just Another Social Media</span> is just another social media in
        the web, which is produced mainly as a full stack project for portfolio.
        So if you've come across this somehow, maybe play around with it...?
      </header>
      <div className="landing__links">
        <Link to="/login" className="btn btn-secondary btn-lg">
          Log in
        </Link>
        <Link to="/signup" className="btn btn-secondary btn-lg">
          Sign up
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
