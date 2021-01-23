/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReactLoading from "react-loading";
import Post from "./Post";
import EditProfile from "./EditProfile";
import requests from "../config/axios";
import { setAlert } from "../actions/alert";
import { getImageUrl } from "../config/firebase";
import { logout } from "../actions/auth";

const Profile = ({ user, setAlert, match, logout }) => {
  const [editMode, setEditMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [posts, setPosts] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [profileUserPhoto, setProfileUserPhoto] = useState(null);
  const [isFollowing, setIsFollowing] = useState(null);
  const [btnToDelte, setBtnToDelete] = useState(false);
  const [passwordToDlt, setPasswordToDlt] = useState("");

  const handlePostDelete = async (postId) => {
    const response = await requests.delete("/api/posts/", { data: { postId } });
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
    setAlert(response.data, "success");
  };

  const deletedByMe = () => {
    requests
      .delete(`/api/users/${match.params.id}`)
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e.response.data));
  };

  const handleAccountDelete = (e) => {
    e && e.preventDefault();
    if (passwordToDlt.length > 0) {
      const data = { id: user.id, password: passwordToDlt };
      requests
        .delete("/api/users/", { data })
        .then((res) => {
          logout();
          setAlert(res.data, "danger");
        })
        .catch((e) => setAlert(e.response.data, "danger"));
    }
  };

  useEffect(() => {
    requests.get(`/api/users/${match.params.id}`).then((res) => {
      setProfileUser(res.data);
      if (res.data.photo) {
        getImageUrl(res.data.photo).then((url) => setProfileUserPhoto(url));
      }
    });
    if (user) {
      requests
        .get(`/api/posts/${match.params.id}`)
        .then((res) => setPosts(res.data));

      requests.get(`/api/following/${user.id}`).then((res) => {
        const followings = res.data;
        followings.forEach((follow) => {
          if (follow.followee == match.params.id) {
            setIsFollowing(follow);
            return;
          }
        });
      });
    }
  }, [user, match.params]);

  if (!user || !profileUser) {
    return (
      <ReactLoading
        className="m-auto"
        type="cubes"
        color="#c2c0b0"
        height={80}
        width={80}
      />
    );
  } else {
    const { name: userName, bio, email } = profileUser;
    const { is_staff } = user;
    return (
      <div className="profile container pt-2">
        <div className="profile__header d-flex">
          {is_staff && (
            <button
              onClick={deletedByMe}
              className="btn btn-danger btn-sm position-absolute bottom-0 "
            >
              DELETE ACCOUNT
            </button>
          )}
          {user.id == match.params.id ? (
            <div className="profile__edit d-flex flex-column">
              <button
                onClick={() => {
                  setChangePassword(false);
                  setEditMode(!editMode);
                }}
                className="btn btn-sm btn-info"
              >
                Edit Information
              </button>
              <button
                onClick={() => {
                  setChangePassword(true);
                  setEditMode(!editMode);
                }}
                className="btn btn-sm btn-info mt-2"
              >
                Change Password
              </button>
              <button
                onClick={() => setBtnToDelete(!btnToDelte)}
                className="btn btn-sm btn-danger mt-2"
              >
                Delete Account
              </button>
              {btnToDelte && (
                <form
                  onSubmit={handleAccountDelete}
                  className="profile__confirmDlt"
                >
                  <input
                    autoComplete="username"
                    type="text"
                    className="d-none"
                  />
                  <input
                    value={passwordToDlt}
                    onChange={(e) => setPasswordToDlt(e.target.value)}
                    type="password"
                    placeholder="Enter password"
                    autoComplete="password"
                  />
                  <button type="submit" className="btn btn-danger">
                    DELETE!
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="profile__follow">
              {isFollowing ? (
                <button
                  onClick={() => {
                    const data = { followingId: isFollowing.id };
                    requests
                      .delete("/api/following/", { data })
                      .then(() => setIsFollowing(null));
                  }}
                  className="btn btn-lg btn-danger"
                >
                  Unfollow <i className="fa fa-minus" aria-hidden="true"></i>
                </button>
              ) : (
                <button
                  onClick={() => {
                    const data = {
                      followerId: user.id,
                      followeeId: profileUser.id,
                    };
                    requests
                      .post("/api/following/", data)
                      .then((res) => setIsFollowing(res.data));
                  }}
                  className="btn btn-lg btn-info"
                >
                  Follow <i className="fa fa-plus" aria-hidden="true"></i>
                </button>
              )}
            </div>
          )}
          <img
            className="me-2"
            alt={user.name}
            src={
              profileUserPhoto
                ? profileUserPhoto
                : require("../assets/photos/userdefault.png").default
            }
          />
          <div className="d-flex flex-column">
            <p className="profile__username">{userName}</p>
            <p className="profile__email">{email}</p>
          </div>
        </div>
        <div className="profile__bio mt-2">
          {!bio || bio === "" ? <p>Edit and add a bio</p> : <p>{bio}</p>}
        </div>
        {editMode && (
          <EditProfile
            changePassword={changePassword}
            setEditMode={setEditMode}
            user={user}
          />
        )}
        <div className="feed_posts mt-4">
          {posts &&
            posts.map((post) => (
              <Post
                handlePostDelete={handlePostDelete}
                key={post.id}
                post={post}
              />
            ))}
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { setAlert, logout })(Profile);
