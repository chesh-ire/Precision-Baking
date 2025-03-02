const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
    ingredient: { type: String, required: true },
    volume: { type: String },  
    mass_grams: { type: Number, required: true },  
    conversions: {
        cup: { type: Number, required: true },
        tablespoon: { type: Number, required: true },
        teaspoon: { type: Number, required: true }
    }
});

module.exports = mongoose.model("Ingredient", ingredientSchema);

