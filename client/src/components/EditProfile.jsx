import React, { useState } from "react";
import { setAlert } from "../actions/alert";
import { connect } from "react-redux";
import requests from "../config/axios";
import { setUser } from "../actions/auth";

const EditProfile = ({
  user,
  setAlert,
  setEditMode,
  setUser,
  changePassword,
}) => {
  const { id } = user;
  const [userName, setUserName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [email, setEmail] = useState(user.email || "");
  const [image, setImage] = useState(null);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!image) {
        const response = await requests.post(`/api/users/${id}`, {
          name: userName,
          bio,
          email,
        });
        setAlert(response.data, "success");
        setUser(id);
        setEditMode(false);
      } else {
        const formData = new FormData();
        formData.append("name", userName);
        formData.append("bio", bio);
        formData.append("email", email);
        formData.append("image", image);
        const response = await requests.post(`/api/users/${id}`, formData);
        setAlert(response.data, "success");
        setUser(id);
        setEditMode(false);
      }
    } catch (error) {
      if (error.response.status === 400) {
        setAlert(error.response.data, "danger");
      }
    }
  };

  return !changePassword ? (
    <form onSubmit={handleSubmit} className="profile__editForm mt-2">
      <input
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
        type="text"
        className="form-control"
        placeholder="Name"
      />
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="form-control"
        placeholder="Email"
      />
      <input
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        type="text"
        className="form-control"
        placeholder="Bio"
      />
      <div className="d-flex mt-2 justify-content-between align-items-center">
        <label className="btn btn-primary" htmlFor="imagefile">
          Change DP <i className="fa fa-user" aria-hidden="true"></i>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="imagefile"
            name="image"
            className="d-none"
          />
        </label>
        <input type="submit" value="Save" className="btn btn-success" />
      </div>
    </form>
  ) : (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (password2.length < 6) {
          setAlert("New password must be at least 6 characters", "warning");
        } else {
          requests
            .post("/api/users/changepassword", { id, password, password2 })
            .then((res) => {
              setEditMode(false);
              setAlert(res.data, "success");
            })
            .catch((error) => {
              setAlert(error.response.data, "danger");
              setPassword("");
              setPassword2("");
            });
        }
      }}
      className="profile__editForm mt-2 text-start"
    >
      <input autoComplete="username" type="text" className="d-none" />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="form-control"
        placeholder="Old password"
        autoComplete="old-password"
      />
      <input
        onChange={(e) => setPassword2(e.target.value)}
        value={password2}
        type="password"
        className="form-control"
        autoComplete="new-password"
        placeholder="New password"
      />
      <input
        type="submit"
        value="Update password"
        className="btn btn-success"
      />
    </form>
  );
};

export default connect(null, { setAlert, setUser })(EditProfile);
