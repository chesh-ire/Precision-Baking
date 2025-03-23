// document.addEventListener("DOMContentLoaded", function () {
//     const searchForm = document.querySelector(".search-form");
//     const ingredientsInput = document.getElementById("ingredients");

//     searchForm.addEventListener("submit", async function (event) {
//         event.preventDefault(); // Prevent form submission

//         const dish = ingredientsInput.value.trim();

//         if (!dish) {
//             alert("Please enter a dish name.");
//             return;
//         }

//         try {
//             // Call the Flask backend to fetch recipes from Gemini API
//             const response = await fetch("http://localhost:5000/generate-recipe", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ dish: dish }),
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to fetch recipes");
//             }

//             const data = await response.json();
//             displayRecipes(data.recipe); // Display the recipe in the UI
//         } catch (error) {
//             console.error("Error:", error);
//             alert("An error occurred while fetching recipes. Please try again.");
//         }
//     });

//     function displayRecipes(recipe) {

//         //***Parsing */
//         const recipe = parseRecipe(recipeText);
//         //***Parsing */

//         // Clear previous results
//         const resultsContainer = document.querySelector(".results-container");
//         if (resultsContainer) {
//             resultsContainer.innerHTML = ""; // Clear existing content
//         }

//         // Create a new recipe card
//         const recipeCard = document.createElement("div");
//         recipeCard.className = "recipe-card";

//         const recipeContent = document.createElement("div");
//         recipeContent.className = "recipe-content";

//         const recipeTitle = document.createElement("h3");
//         recipeTitle.className = "recipe-title";
//         //**Parsing */
//         recipeTitle.textContent = recipe.title || "Generated Recipe";
//         //**Parsing */

//          //**Parsing */
//         // const recipeText = document.createElement("p");
//         // recipeText.textContent = recipe;
//         //**Parsing */

//         //**Parsing */
//         const recipeIngredients = document.createElement("div");
//         recipeIngredients.className = "recipe-ingredients";
//         recipeIngredients.innerHTML = `<h4>Ingredients</h4><ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}</ul>`;

//         const recipeInstructions = document.createElement("div");
//         recipeInstructions.className = "recipe-instructions";
//         recipeInstructions.innerHTML = `<h4>Instructions</h4><ol>${recipe.instructions.map(step => `<li>${step}</li>`).join("")}</ol>`;
//       //**Parsing */


//         recipeContent.appendChild(recipeTitle);
//         //**Parisng */
//         // recipeContent.appendChild(recipeText);
//         recipeContent.appendChild(recipeIngredients);
//         recipeContent.appendChild(recipeInstructions);
//         //**Parsing */
//         recipeCard.appendChild(recipeContent);

//         // Append the recipe card to the results container
//         if (resultsContainer) {
//             resultsContainer.appendChild(recipeCard);
//         } else {
//             // If results container doesn't exist, create one
//             const newResultsContainer = document.createElement("div");
//             newResultsContainer.className = "results-container";
//             newResultsContainer.appendChild(recipeCard);
//             document.querySelector(".search-container").appendChild(newResultsContainer);
//         }
//     }

//     //**Parsing */
//     function parseRecipe(recipeText) {
//         // Example parsing logic (customize based on Gemini's response format)
//         const lines = recipeText.split("\n");
//         const title = lines[0] || "Generated Recipe";
//         const ingredients = lines.filter(line => line.startsWith("-")).map(line => line.replace("-", "").trim());
//         const instructions = lines.filter(line => line.match(/^\d+\./)).map(line => line.replace(/^\d+\./, "").trim());

//         return {
//             title,
//             ingredients,
//             instructions
//         };
//     }
//     //**Parisng */
// });



//new code###
document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.querySelector(".search-form");
    const ingredientsInput = document.getElementById("ingredients");
    const resultsContainer = document.querySelector(".results-container");

    if (!searchForm || !ingredientsInput || !resultsContainer) {
        console.error("Form or input element not found!");
        return;
    }

    // **eliminating page loding issue
    // Check if there's saved data in localStorage
    // const savedRecipe = localStorage.getItem("recipe");
    // const savedImageUrl = localStorage.getItem("imageUrl");

    // if (savedRecipe && savedImageUrl) {
    //     // Display the saved recipe and image
    //     displayRecipes(savedRecipe, savedImageUrl);
    // }
    //**eliminating page loading issue */

    searchForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form submission
        console.log("Form submission prevented.");

        const dish = ingredientsInput.value.trim();
        console.log("Dish entered:", dish);

        if (!dish) {
            alert("Please enter a dish name.");
            return;
        }

        try {
            console.log("Fetching recipe from backend...");
            const response = await fetch("http://localhost:5000/generate-recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ dish: dish }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch recipes");
            }

            const data = await response.json();
            console.log("Recipe data received:", data);
            if (!data.recipe) {
                throw new Error("No recipe found in the response.");
            }

            // Log the image URL for debugging
console.log("Image URL:", data.imageUrl);


            // **changes
            // Fetch the related image for the recipe using the Gemini API
            // const imageResponse = await fetch("http://localhost:5000/get-recipe-image", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({ dish: dish }),
            // });

            // if (!imageResponse.ok) {
            //     throw new Error("Failed to fetch recipe image");
            // }

            // const imageData = await imageResponse.json();
            // const imageUrl = imageData.imageUrl;

        // **changes

            //**eliminate the loding page issue */
         // Save the recipe and image URL to localStorage
         localStorage.setItem("recipe", data.recipe);
         localStorage.setItem("imageUrl", data.imageUrl);
         //**eliminate the loding page issue */

            displayRecipes(data.recipe,data.imageUrl); // Display the recipe in the UI
        } catch (error) { // Explicitly type the error object
            console.error("Error:", error);
            alert(`An error occurred: ${error.message}`);
        }
    });

    function displayRecipes(recipeText) {
        console.log("Displaying recipe:", recipeText);

        // Parse the recipe text into structured data
        const recipe = parseRecipe(recipeText);
        console.log("Parsed recipe:", recipe); 

        // Clear previous results
        const resultsContainer = document.querySelector(".results-container");
        if (!resultsContainer) {
            // Clear existing content
            console.error("Results container not found!");
        return;
        }
        resultsContainer.innerHTML = "";

           // Use a fallback image if the image URL is invalid
    // const validImageUrl = imageUrl.startsWith("http") ? imageUrl : "https://source.unsplash.com/800x600/?food";
    const localImageUrl = "background-img.jpg";
        // **changes
        // Set the image as the background of the results container
        resultsContainer.style.backgroundImage = `url(${localImageUrl})`;
        resultsContainer.style.backgroundSize = "cover";
        resultsContainer.style.backgroundPosition = "center";
        resultsContainer.style.padding = "20px"; // Add padding for the white menu card effect
        // **changes

        // Create a new recipe card
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";

        // **changes
        recipeCard.style.backgroundColor = "rgba(255, 255, 255, 0.7)"; // White background with transparency
        recipeCard.style.borderRadius = "12px";
        recipeCard.style.padding = "20px";
        recipeCard.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
         // **changes

        const recipeContent = document.createElement("div");
        recipeContent.className = "recipe-content";

        const recipeTitle = document.createElement("h3");
        recipeTitle.className = "recipe-title";
        recipeTitle.textContent = recipe.title || "Generated Recipe";
        recipeContent.appendChild(recipeTitle);

        // Add ingredients
        if(recipe.ingredients && recipe.ingredients.length>0)
        {
            const recipeIngredients = document.createElement("div");
            recipeIngredients.className = "recipe-ingredients";
            recipeIngredients.innerHTML = `<h4>Ingredients</h4><ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}</ul>`;
            recipeContent.appendChild(recipeIngredients);
        }
        else{
            console.warn("No ingredients found in the recipe.");
        }
       

        // Add instructions (without numbering)
        if (recipe.instructions && recipe.instructions.length > 0) {
            const recipeInstructions = document.createElement("div");
            recipeInstructions.className = "recipe-instructions";
            recipeInstructions.innerHTML = `<h4>Instructions</h4><ol>${recipe.instructions.map(step => `<li>${step}</li>`).join("")}</ol>`;
            recipeContent.appendChild(recipeInstructions);
        } else {
            console.warn("No instructions found in the recipe.");
        }

        

        recipeCard.appendChild(recipeContent);
    resultsContainer.appendChild(recipeCard);

        // Append the recipe card to the results container
        if (resultsContainer) {
            resultsContainer.appendChild(recipeCard);
        } else {
            console.error("Results container not found!");
        }
    }

    //  **changes
    //  **changes
    function parseRecipe(recipeText) {
        console.log("Parsing recipe text:", recipeText);

        // Split the recipe text into lines
        const lines = recipeText.split("\n").map(line => line.trim()).filter(line => line);;

        // Extract the title (first line)
        // const title = lines[0].replace("##", "").trim();
        const title = lines[0].startsWith("##") ? lines[0].replace("##", "").trim() : "Untitled Recipe";


        // Find the start of the ingredients and instructions sections
        const ingredientsIndex = lines.findIndex(line => line.toLowerCase().includes("ingredients"));
        const instructionsIndex = lines.findIndex(line => line.toLowerCase().includes("instructions"));
         // **changes
        // const ingredientsIndex = lines.findIndex(line => /^ingredients$/i.test(line));
        // const instructionsIndex = lines.findIndex(line =>/^instructions$/i.test(line));
        // **changes

        // Extract ingredients
        const ingredients = [];
        
        if (ingredientsIndex !== -1) {
            for (let i = ingredientsIndex + 1; i < (instructionsIndex !== -1 ? instructionsIndex : lines.length); i++) {
                const line = lines[i].trim();
                // if (line && !line.startsWith("*")) { // Skip lines with * (e.g., *Yields:**)
                //     ingredients.push(line.replace(/^\d+\.\s*/, "").trim()); // Remove numbering and trim
                // }

                if (line) { // Only include lines that start with "-"
                    ingredients.push(line.replace(/^[-*]\s*/, "").trim()); // Remove the "-" and trim
                }
            }
        }

        // Extract instructions
        const instructions = [];
        if (instructionsIndex !== -1) {
            for (let i = instructionsIndex + 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line && !line.startsWith("*")) { // Skip lines with * (e.g., *For a richer flavor:**)
                    instructions.push(line.replace(/^\d+\.\s*/, "").trim()); // Remove numbering and trim
                }
            }
        }

        return {
            title,
            ingredients,
            instructions
        };
    }
});