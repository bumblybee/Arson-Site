const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/fileUpload");
const { isAuth } = require("../middleware/isAuth");
const { catchErrors } = require("../handlers/errorHandlers");
const newsController = require("../controllers/newsController");

router.get("/compose", isAuth, newsController.getComposeNews);

router.post("/compose", upload, isAuth, newsController.composeNews);

router.get("/edit/:id", isAuth, newsController.getEditNewsForm);

router.put("/edit/:id", isAuth, newsController.editNews);

router.get("/:id", newsController.getNewsPost);

router.get("/", newsController.getNews);

router.post("/delete/:id", isAuth, newsController.deleteNewsPost);

module.exports = router;
