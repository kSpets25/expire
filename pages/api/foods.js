import dbConnect from "../../db/Connection";
import Food from "../../db/models/Food";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { barcode, name } = req.query;
    let query = {};

    if (barcode) query.code = barcode;
    if (name) query.product_name = { $regex: name, $options: "i" };

    const foods = await Food.find(query).limit(50).lean();
    return res.status(200).json({
      success: true,
      product: foods,
    });
  }

  if (req.method === "POST") {
    try {
      const food = await Food.create(req.body);
      return res.status(201).json({
        success: true,
        food,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Food already saved",
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  res.status(405).end("Method Not Allowed");
}

