const express = require("express");
const cors = require("cors");
const user = require("./api/user");
const post = require("./api/post");
const comment = require("./api/comment");
const like = require("./api/like");
const following = require("./api/following");
const middlewares = require("./middlewares");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("./public"));

app.use("/api/users", user);
app.use("/api/posts", post);
app.use("/api/comments", comment);
app.use("/api/likes", like);
app.use("/api/following", following);

//not found handler
app.use(middlewares.notFound);

//general error handler
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;

app.listen(port, () => console.log("listening on " + port));
