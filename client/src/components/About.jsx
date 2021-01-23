import React from "react";

const About = () => {
  return (
    <div className="about container">
      <p>
        Hello, this is Ahmed. This{" "}
        <span className="about__smedia">"social-media"</span> site is developed
        in purpose of a full stack application. ExpressJS and Postgres is used
        in the server, and React in client. <br />
        So basically we can create an account with some basic information,
        follow other accounts, create posts optionally with photo, and add like
        or comment to a post. Feed will serve the contents posted by the user's
        account and the accounts that are being 'followed' by the user. Profile
        will contain only the user's posts. You can delete a post if it's made
        by you, and delete a comment if it's made by you or it belongs to a post
        made by you.
        <br /> Also <span className="about__firebase">firebase</span> storage is
        used to store profile pictures and post photos. It's not a huge thing,
        but probably I learned the MOST till now creating this project.
      </p>
    </div>
  );
};

export default About;
