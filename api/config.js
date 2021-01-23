const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const path = require("path");

const storage = new Storage({
  keyFilename: path.join(
    __dirname,
    "../social-media-100-firebase-adminsdk-3x1mw-55eb6ff6f6.json"
  ),
});

const multerStorage = multer.diskStorage({
  destination: "./public/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: multerStorage,
}).single("image");

const bucketName = "social-media-100.appspot.com";
const jwtsecret = process.env.jwtsecret;

module.exports = { jwtsecret, storage, upload, bucketName };
