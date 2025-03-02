const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Ingredient = require("../models/Ingredient");


mongoose.connect("mongodb://localhost:27017/precision_baking", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const filePath = path.join(__dirname, "../data/ingredients.json");

fs.readFile(filePath, "utf8", async (err, data) => {
  if (err) {
    console.error("Error reading JSON file:", err);
    mongoose.connection.close();
    return;
  }

  try {
    const ingredients = JSON.parse(data);

    await Ingredient.deleteMany({}); 
    await Ingredient.insertMany(ingredients); 

    console.log("Data imported successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error importing data:", error);
    mongoose.connection.close();
  }
});
