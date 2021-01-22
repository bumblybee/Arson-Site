const { Recipe } = require("../models");
const { checkAuth } = require("../middleware/isAuth");

exports.getRecipes = (req, res) => {
  const { auth } = checkAuth(req.cookies["_PAS"]);
  Recipe.find({ isDeleted: false }, (err, recipes) => {
    if (err) throw err;

    res.render("recipes", { recipes, auth });
  }).sort({ date: -1 });
};

exports.getRecipe = (req, res) => {
  const { auth } = checkAuth(req.cookies["_PAS"]);
  const id = req.params.id;

  Recipe.findOne({ _id: id }, (err, recipe) => {
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

exports.getComposeRecipe = (req, res) => {
  const { auth } = checkAuth(req.cookies["_PAS"]);
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

  newRecipe.save();
  setTimeout(() => {
    res.redirect("/recipes");
  }, 2000);
};

exports.getEditRecipeForm = (req, res) => {
  const id = req.params.id;
  const { auth } = checkAuth(req.cookies["_PAS"]);

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

  Recipe.updateOne(
    { _id: id },
    {
      title: req.body.title,
      date: req.body.date,
      content1: req.body.content1,
      content2: req.body.content2,
      content3: req.body.content3,
      submittedBy: req.body.submittedBy,
      comment: req.body.comment,
    },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        setTimeout(() => {
          res.redirect(`/recipes/${id}`);
        }, 2000);
      }
    }
  );
};

exports.deleteRecipe = (req, res) => {
  const id = req.params.id;
  Recipe.updateOne({ _id: id }, { isDeleted: true }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      setTimeout(() => {
        res.redirect(`/recipes`);
      }, 1500);
    }
  });
};
