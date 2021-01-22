const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/fileUpload");
const { isAuth } = require("../middleware/isAuth");
const { catchErrors } = require("../handlers/errorHandlers");
const recipeController = require("../controllers/recipeController");

router.get("/compose", isAuth, recipeController.getComposeRecipe);

router.post("/compose", upload, isAuth, recipeController.composeRecipe);

router.get("/edit/:id", isAuth, recipeController.getEditRecipeForm);

router.put("/edit/:id", isAuth, recipeController.editRecipe);

router.get("/:id", recipeController.getRecipe);

router.get("/", recipeController.getRecipes);

router.post("/delete/:id", isAuth, recipeController.deleteRecipe);

module.exports = router;
