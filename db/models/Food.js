// db/models/Food.js
import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    product_name: String,
    brands: String,
    nutriscore_grade: String,
    nutriments: Object,
    image_small_url: String,
    expirationDate: Date,
  },
  { timestamps: true }
);

// Prevent model overwrite on hot reload
export default mongoose.models.Food ||
  mongoose.model("Food", FoodSchema);


