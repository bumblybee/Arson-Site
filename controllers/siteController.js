const { Recipe, News } = require("../models");
const { checkAuth } = require("../middleware/isAuth");

// TODO: Check if need token data anywhere, else remove

// TODO: Delete option

// TODO: Uncomment db saves at edit and compose before launch

exports.getHome = async (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);
  let recipes = await Recipe.find().sort({ date: -1 });
  let news = await News.find().sort({ date: -1 });
  recipes = recipes.filter((recipe, index) => index < 2);
  news = news.filter((news, index) => index < 1)[0];

  res.render("home", { recipes, news, auth });
};

exports.getStory = (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);
  res.render("story", { auth });
};

exports.getRecipes = (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);
  Recipe.find({}, (err, recipes) => {
    if (err) throw err;
    res.render("recipes", { recipes, auth });
  }).sort({ date: -1 });
};

exports.getRecipe = (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);
  const recipeID = req.params.recipeID;

  Recipe.findOne({ _id: recipeID }, (err, recipe) => {
    if (err) throw err;
    if (recipe) {
      const title = recipe.title;
      const content1 = recipe.content1;
      const content2 = recipe.content2;
      const content3 = recipe.content3;
      const date = recipe.date;
      const submittedBy = recipe.submittedBy;
      const images = recipe.images;

      res.render("recipe", {
        id: recipe._id,
        title,
        content1,
        content2,
        content3,
        date,
        submittedBy,
        images,
        auth,
      });
    }
  });
};

exports.getPricing = (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);
  //TODO: Add pricing file upload option
  const url = "https://arsonsauce.com/pdf/pricing.pdf";
  res.render("pricing", { url, auth });
};

exports.getComposeRecipe = (req, res) => {
  const { auth, token } = checkAuth(req.cookies["PAS"]);
  res.render("auth/composeRecipe", { auth });
};

exports.composeRecipe = (req, res) => {
  const newRecipe = new Recipe({
    title: req.body.title,
    date: req.body.date,
    content1: req.body.content1,
    content2: req.body.content2,
    content3: req.body.content3,
    submittedBy: req.body.submittedBy,
    comment: req.body.comment,
    images: req.files,
  });

  // newRecipe.save();
  console.log(newRecipe);
  res.redirect("/recipes");
};

exports.getEditRecipeForm = (req, res) => {
  const id = req.params.id;
  const { auth, token } = checkAuth(req.cookies["PAS"]);

  Recipe.findOne({ _id: id }, (err, recipe) => {
    if (err) throw err;
    if (recipe) {
      res.render("auth/editRecipeForm", {
        id: recipe._id,
        title: recipe.title,
        date: recipe.date,
        content1: recipe.content1,
        content2: recipe.content2,
        content3: recipe.content3,
        submittedBy: recipe.submittedBy,
        comment: recipe.comment,
        images: recipe.images,
        auth,
      });
    } else {
      console.log("something went wrong");
    }
  });
};

exports.editRecipe = (req, res) => {
  const id = req.params.id;
  console.log(req.params, req.body);
  // Recipe.updateOne(
  //   { _id: id },
  //   {
  //     title: req.body.title,
  //     date: req.body.date,
  //     content1: req.body.content1,
  //     content2: req.body.content2,
  //     content3: req.body.content3,
  //     submittedBy: req.body.submittedBy,
  //     comment: req.body.comment,
  //   },
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log(result);
  //       res.redirect(`/recipes/${id}`);
  //     }
  //   }
  // );
};
