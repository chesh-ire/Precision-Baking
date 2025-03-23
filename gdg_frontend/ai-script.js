document.addEventListener("DOMContentLoaded", function () {
    const recipeForm = document.getElementById("recipe-form");
    const successMessage = document.getElementById("success-message");
    const outputSection = document.getElementById("output-section");
    const outputIngredient = document.getElementById("output-ingredient");
    const outputVolume = document.getElementById("output-volume");
    const outputMass = document.getElementById("output-mass");

     // Debugging: Check if elements exist
     console.log("Output Section:", outputSection);
     console.log("Output Ingredient:", outputIngredient);
     console.log("Output Volume:", outputVolume);
     console.log("Output Mass:", outputMass);
 
     if (!outputSection || !outputIngredient || !outputVolume || !outputMass) {
         console.error("One or more output elements are missing in the DOM!");
     }
     

    recipeForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form submission
       //changes:
       console.log("Form submission intercepted");
       //changes:

        // Get form data
        const recipeName = document.getElementById("recipe-name").value.trim();
        const ingredient = document.getElementById("ingredient").value.trim();
        const volume = document.getElementById("volume").value.trim();
         // Log form data
        console.log("Form data:", { recipeName, ingredient, volume });
        // Log form data
        if (!recipeName || !ingredient || !volume) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            // Show loading indicator (optional)
            const submitButton = recipeForm.querySelector("button[type='submit']");
            submitButton.disabled = true;
            submitButton.innerText = "Submitting...";

            // Send data to the Flask backend
            // Log the request
            console.log("Sending request to backend...");
            // Log the request
            const response = await fetch("http://localhost:5000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ingredient: ingredient,
                    volume: volume,
                }),
            });
              //changes - logging the response status
              console.log("Response status:", response.status); 
              //changes - logging the response statue
            if (!response.ok) {
                const errorData = await response.json();
                //changes - Log the error response
                console.error("Error response:", errorData);
                //changes - Log the error response
                throw new Error(errorData.error || "Failed to process recipe");
            }

            const data = await response.json();
            // changes-Log the response data
            console.log("Response data:", data);
            // changes-Log the response data

            // // Display the predicted mass
            // alert(`Predicted mass for ${ingredient} (${volume}): ${data.predicted_mass}`);
               // Update the output section
               outputIngredient.textContent = ingredient;
               outputVolume.textContent = volume;
               outputMass.textContent = data.predicted_mass;
               outputSection.style.display = "block"; // Show the output section

            // Show success message
            successMessage.style.display = "block";

            // Clear the form (optional)
            //recipeForm.reset();
           //****try to  remove this*****

           //*****changes: */
           // Clear only the ingredient and volume fields
           document.getElementById("ingredient").value = "";
           document.getElementById("volume").value = "";
           document.getElementById("recipe-name").value = "";
           //***** changes: */

        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.message}`);
        } finally {
            // Reset the submit button (optional)
            const submitButton = recipeForm.querySelector("button[type='submit']");
            submitButton.disabled = false;
            submitButton.innerText = "Submit Recipe";
        }
    });
});


// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.getElementById("recipe-form");
//     const recipeTextInput = document.getElementById("recipe-text");

//     form.addEventListener("submit", async function (event) {
//         event.preventDefault(); // Prevent form submission reload
        
//         const recipeText = recipeTextInput.value.trim();

//         if (recipeText === "") {
//             alert("Please enter a recipe before submitting.");
//             return;
//         }

//         console.log("Sending recipe for AI processing:", recipeText);

//         try {
//             const response = await fetch("http://127.0.0.1:5000/process-recipe", {  // Flask server URL
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({ recipe_text: recipeText })
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 console.log("AI Response:", result);
//                 alert(`AI Response: ${result.message}`);
//             } else {
//                 alert(`Error: ${result.error}`);
//             }
//         } catch (error) {
//             console.error("Error communicating with AI model:", error);
//             alert("Failed to process recipe. Ensure the Flask server is running.");
//         }
//     });
// });
