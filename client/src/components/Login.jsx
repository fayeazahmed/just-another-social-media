import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../actions/auth";

const Login = ({ isAuthenticated, login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  if (isAuthenticated) return <Redirect to="/feed" />;

  return (
    <div className="signin container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(email, password);
          setEmail("");
          setPassword("");
        }}
      >
        <label htmlFor="loginemail">Enter email:</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control text-start"
          type="text"
          name="loginemail"
          id="loginemail"
          autoComplete="username"
        />
        <label htmlFor="loginpassword">Enter password:</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control text-start"
          type="password"
          name="loginpassword"
          id="loginpassword"
          autoComplete="current-password"
        />
        <input
          className="btn btn-secondary mt-3"
          type="submit"
          value="Log in"
        />
        <small className="d-block text-start mt-2">
          Don't have an account? <Link to="/signup">Create now</Link>
        </small>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
