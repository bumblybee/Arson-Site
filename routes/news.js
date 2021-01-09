const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const { catchErrors } = require("../handlers/errorHandlers");
const newsController = require("../controllers/newsController");

const multer = require("multer");
const crypto = require("crypto");

const randomId = crypto.randomBytes(5).toString("hex");

// --------------- Multer Setup ---------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img");
  },
  filename: (req, file, cb) => {
    //Added randomID in case same photo name uploaded later
    cb(
      null,
      file.originalname.split(".")[0] +
        randomId +
        "." +
        file.originalname.split(".")[1]
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/compose", isAuth, newsController.getComposeNews);
router.post("/compose", upload.any(), isAuth, newsController.composeNews);

router.get("/edit/:id", isAuth, newsController.getEditNewsForm);
router.post("/edit/:id", isAuth, newsController.editNews);

router.get("/:id", newsController.getNewsPost);

router.get("/", newsController.getNews);

module.exports = router;
