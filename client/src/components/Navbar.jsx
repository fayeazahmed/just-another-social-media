import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { logout, setUser } from "../actions/auth";
import { connect } from "react-redux";
import requests, { setAuthToken } from "../config/axios";
import Alert from "./Alert";
import { useState } from "react";
import { setAlert } from "../actions/alert";

const Navbar = ({ logout, isAuthenticated, setUser, setAlert, user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInMobile, setSearchInMobile] = useState(false);

  useEffect(() => {
    if (sessionStorage["userId"]) {
      setAuthToken();
      setUser();
    }
  }, [setUser]);

  const visibility = {
    visibility: "visible",
  };

  return (
    <nav>
      <Link to="/">
        <header>
          Just Another <br />
          Social Media
        </header>
      </Link>
      {isAuthenticated && (
        <form
          style={searchInMobile ? visibility : {}}
          onSubmit={(e) => {
            e.preventDefault();
            requests
              .post("/api/users/search", { searchTerm, userId: user.id })
              .then((res) => setSearchResult(res.data))
              .catch((error) => setAlert(error.response.data, "warning"));
            setSearchTerm("");
          }}
        >
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-start form-control"
            type="text"
            name="search"
            placeholder="Search for users. Try 'Ahmed'"
          />
        </form>
      )}
      {searchResult && (
        <div
          onClick={() => {
            setSearchResult(null);
            setSearchInMobile(false);
          }}
          className="searchDiv"
        >
          <button className="btn btn-warning btn-sm">X</button>
          {searchResult.map((user) => (
            <Link
              to={`/profile/${user.id}`}
              key={user.id}
              className="searchDiv__user"
            >
              <h4 className="text-start">{user.name}</h4>
              <h6 className="text-start">{user.email}</h6>
            </Link>
          ))}
        </div>
      )}
      <div
        onClick={() => setMenuOpen(false)}
        className={`navbtns ${menuOpen && "navbtns--activated"}`}
      >
        <Link to="/about">
          <button className="btn btn-secondary">About</button>
        </Link>
        {isAuthenticated && user ? (
          <>
            <Link to={`/profile/${user.id}`}>
              <button className="btn btn-secondary">Profile</button>
            </Link>
            <button
              onClick={() => {
                logout();
                setAlert("Logged out", "success");
              }}
              className="btn btn-secondary"
            >
              <i className="fa fa-sign-out fa-2x" aria-hidden="true"></i>
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="btn btn-secondary">Sign In</button>
          </Link>
        )}
      </div>
      <div className="menu">
        {isAuthenticated && (
          <i
            onClick={() => setSearchInMobile(!searchInMobile)}
            className="fa fa-search fa-2x btn"
            aria-hidden="true"
          ></i>
        )}
        <i
          onClick={() => setMenuOpen(!menuOpen)}
          className="fa fa-bars fa-2x btn"
          aria-hidden="true"
        ></i>
      </div>
      <Alert />
    </nav>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout, setUser, setAlert })(Navbar);
