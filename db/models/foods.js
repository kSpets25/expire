// db/models/foods.js
import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // new: associate with logged-in user
    code: { type: String, required: true },
    product_name: String,
    brands: String,
    nutriscore_grade: String,
    nutriments: Object,
    image_small_url: String,
    quantity: Number,
    unit: String,
    expirationDate: Date,
  },
  { timestamps: true }
);

// Prevent model overwrite on hot reload
export default mongoose.models.Food || mongoose.model("Food", FoodSchema);
