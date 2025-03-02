const express = require("express");
const mongoose = require("mongoose");
const ingredientRoutes = require("./routes/ingredientRoutes");

const app = express();
const PORT = process.env.PORT || 5000;


mongoose
  .connect("mongodb://localhost:27017/precision_baking", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.use('/api/ping',(req,res)=>{res.send('pong')})
app.use("/api/ingredients", ingredientRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
