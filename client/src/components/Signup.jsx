import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../actions/auth";
import requests from "../config/axios";
import { setAlert } from "../actions/alert";

const Signup = ({ isAuthenticated, login, setAlert }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  if (isAuthenticated) return <Redirect to="/feed" />;
  return (
    <div className="signin container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (password !== password2) {
            setAlert("Passwords do not match", "warning");
          } else {
            requests
              .post("/api/users/new", { name: username, email, password })
              .then((res) => {
                setAlert(res.data, "success");
                login(email, password);
              })
              .catch((error) => setAlert(error.response.data, "warning"));
            setEmail("");
            setUsername("");
            setPassword("");
            setPassword2("");
          }
        }}
      >
        <label htmlFor="signupemail">Enter email:</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control text-start"
          type="text"
          name="signupemail"
          id="signupemail"
          autoComplete="username"
        />
        <label htmlFor="signupname">Enter name:</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control text-start"
          type="text"
          name="signupname"
          id="signupname"
          autoComplete="name"
        />
        <label htmlFor="signuppassword">Enter password:</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control text-start"
          type="password"
          name="signuppassword"
          id="signuppassword"
          autoComplete="current-password"
        />
        <label htmlFor="signuppassword2">Enter password again:</label>
        <input
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="form-control text-start"
          type="password"
          name="signuppassword2"
          id="signuppassword2"
          autoComplete="current-password"
        />
        <input
          className="btn btn-secondary mt-3"
          type="submit"
          value="Sign up"
        />
        <small className="d-block text-start mt-2">
          Already have an account? <Link to="/login">Login now</Link>
        </small>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login, setAlert })(Signup);
