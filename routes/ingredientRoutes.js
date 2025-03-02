const express = require("express");
const Ingredient = require("../models/Ingredient");

const router = express.Router();


router.get("/convert", async (req, res) => {
    try {
        const { ingredient, amount, unit } = req.query; 
        
        if (!ingredient || !amount || !unit) {
            return res.status(400).json({ error: "Missing required query parameters." });
        }
        const decodedIngredient = decodeURIComponent(ingredient).replace(/\+/g,"").trim();

        console.log("Searching for:", decodedIngredient);
        
        const foundIngredient = await Ingredient.findOne({ ingredient: { $regex: `^${decodedIngredient}$`, $options: "i" } 
        });

        if (!foundIngredient) {
            return res.status(404).json({ error: "Ingredient not found." });
        }

        
        if (!foundIngredient.conversions[unit]) {
            return res.status(400).json({ error: `Invalid unit: ${unit}` });
        }

        
        const grams = parseFloat(amount) * foundIngredient.conversions[unit];

        res.json({ ingredient: decodedIngredient, amount, unit, grams });
    } catch (error) {
        console.error("Error in conversion:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
