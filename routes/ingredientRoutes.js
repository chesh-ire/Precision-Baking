const express = require("express");
const Ingredient = require("../models/Ingredient");

const router = express.Router();


router.get("/convert", async (req, res) => {
    try {
        const { ingredient, amount, unit } = req.query; 
        
        if (!ingredient || !amount || !unit) {
            return res.status(400).json({ error: "Missing required query parameters." });
        }
        // const decodedIngredient = decodeURIComponent(ingredient).replace(/\+/g,"").trim();

        // console.log("Searching for:", decodedIngredient);

        // #changes#Decode and normalize ingredient name
        const decodedIngredient = decodeURIComponent(ingredient).replace(/\+/g, "").trim();
        const normalizedIngredient = decodedIngredient.toLowerCase().replace(/\s+/g, "");

        console.log("Searching for:", decodedIngredient);
        console.log("Normalized Search Query:", normalizedIngredient);

        // #changes#Log all stored ingredients to debug
        // const allIngredients = await Ingredient.find();
        // console.log("Stored Ingredients:", allIngredients.map(i => i.ingredient))
        
        // const foundIngredient = await Ingredient.findOne({ ingredient: { $regex: new RegExp(`^${decodedIngredient}$`, "i") } 
        // });

         // #changes#Find the ingredient with case-insensitive search and ignore spaces
         const foundIngredient = await Ingredient.findOne({ 
            ingredient: { $regex: new RegExp(`^${normalizedIngredient}$`, "i") } 
        });

        if (!foundIngredient) {
            return res.status(404).json({ error: "Ingredient not found." }); //error handling 
        }
   
        // ADD LOGGING HERE  
        console.log(`Found ingredient:`, foundIngredient); 
        
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

