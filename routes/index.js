const express = require("express");
const router = express.Router();
const siteController = require("../controllers/siteController");

// TODO: Move multer config to separate file

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

// ------- Routes -------

router.get("/", siteController.getHome);

router.get("/home", siteController.getHome);

router.get("/news", siteController.getNews);

router.get("/news/:id", siteController.getNewsPost);

router.get("/recipes", siteController.getRecipes);

router.get("/recipes/:recipeID", siteController.getRecipe);

router.get("/story", siteController.getStory);

router.get("/pricing", siteController.getPricing);

//Get rid of sent and sendErr GET routes after design finished
router.get("/sent", (req, res) => {
  res.render("msgSent");
});

router.get("/error", (req, res) => {
  res.render("msgErr");
});

// Render login page
router.get("/login", siteController.getLogin);

//render compose page on login
router.post("/login", siteController.loginUser);

// router.get("/compose/:type", siteController.getComposeType);

router.post("/compose/:type", upload.any(), siteController.compose);

router.post("/edit/:type", siteController.edit);

// Email form submission
router.post("/contact", siteController.sendEmail);

//404 page
router.use(siteController.notFound);

module.exports = router;
