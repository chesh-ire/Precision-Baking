const express = require("express");
const Ingredient = require("../models/Ingredient");

const router = express.Router();

// Function to normalize spaces (trim + replace multiple spaces)
const normalizeSpaces = (str) => str.replace(/\s+/g, " ").trim();

// Function to generate a regex that allows missing spaces
const generateLooseRegex = (str) => {
    return new RegExp(
        "^" + str.replace(/\s*/g, "\\s*") + "$",  // Allow optional spaces
        "i"  // Case-insensitive
    );
};

router.get("/convert", async (req, res) => {
    try {
        const { ingredient, amount, unit } = req.query;

        if (!ingredient || !amount || !unit) {
            return res.status(400).json({ error: "Missing required query parameters." });
        }

        // Normalize input by trimming spaces
        const normalizedIngredient = normalizeSpaces(decodeURIComponent(ingredient));

        console.log("Searching for:", normalizedIngredient);

        // Try finding the ingredient (either exact match or loose space-insensitive match)
        const foundIngredient = await Ingredient.findOne({
            ingredient: { $regex: generateLooseRegex(normalizedIngredient) }
        });

        if (!foundIngredient) {
            return res.status(404).json({ error: "Ingredient not found." });
        }

        if (!foundIngredient.conversions[unit]) {
            return res.status(400).json({ error: `Invalid unit: ${unit}` });
        }

        const grams = parseFloat(amount) * foundIngredient.conversions[unit];

        res.json({ ingredient: normalizedIngredient, amount, unit, grams });
    } catch (error) {
        console.error("Error in conversion:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
