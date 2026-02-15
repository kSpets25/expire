// pages/SearchFoods.js
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./FoodSearch.module.css";

export default function FoodSearch() {
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const [expirationDates, setExpirationDates] = useState({});
  const router = useRouter();

  // Nutri-Score color helper
  const nutriScoreColor = (grade) => {
    switch (grade?.toLowerCase()) {
      case "a": return "#4CAF50";
      case "b": return "#8BC34A";
      case "c": return "#FFEB3B";
      case "d": return "#FF9800";
      case "e": return "#F44336";
      default: return "#ccc";
    }
  };

  // Fetch products from Open Food Facts
  const fetchProduct = async () => {
    if (!barcode && !name) return alert("Enter barcode or product name");

    try {
      if (barcode) {
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        const data = await res.json();
        if (data.status === 1) {
          setProducts([{ ...data.product, quantity: 1, unit: "items" }]);
        } else {
          alert("Product not found");
          setProducts([]);
        }
      } else if (name) {
        const res = await fetch(
          `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(name)}&search_simple=1&json=1`
        );
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products.map(p => ({ ...p, quantity: 1, unit: "items" })));
        } else {
          alert("No products found");
          setProducts([]);
        }
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      alert("Error fetching product from Open Food Facts");
    }
  };

  // Save product to localStorage
  const saveProduct = async (product) => {
    const expirationDate = expirationDates[product.code];
    if (!expirationDate) return alert("Please enter an expiration date");
  
    const productToSave = {
      code: product.code || product._id || product.id,
      product_name: product.product_name || "No name",
      brands: product.brands || "Unknown",
      image_small_url: product.image_small_url || "",
      quantity: product.quantity || 1,
      unit: product.unit || "items",
      expirationDate,
    };
  
    try {
      const res = await fetch("/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSave),
      });
  
      const data = await res.json();
  
      if (!data.success) throw new Error(data.message);
  
      // Clear expiration date input for this product
      setExpirationDates(prev => {
        const copy = { ...prev };
        delete copy[product.code];
        return copy;
      });
  
      alert("Food saved to inventory!");
    } catch (err) {
      console.error("Error saving food:", err);
      alert("Error saving food to inventory: " + err.message);
    }
  };
  
  return (
    <div className={styles.container}>
      

      {/* Search inputs */}
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Enter barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Or enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.inputTwo}
        />
        <button onClick={fetchProduct}>Search</button>
      </div>

      {/* Products grid */}
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.code} className={styles.card}>
            {product.image_small_url && (
              <img className={styles.image}
                src={product.image_small_url}
                alt={product.product_name}
              />
            )}
            <h3>{product.product_name || "No name"}</h3>
            <p>Brand: {product.brands || "Unknown"}</p>
            <p>Barcode: {product.code}</p>

            {product.nutriscore_grade && (
              <span className={`${styles.nutriScore} ${
                styles[product.nutriscore_grade.toLowerCase()] || styles.default
              }`}>
                Nutri-Score: {product.nutriscore_grade.toUpperCase()}
              </span>
            )}

            {/* Expiration date */}
            <label>Expiration Date:</label>
            <input className={styles.callendar}
              type="date"
              value={expirationDates[product.code] || ""}
              onChange={(e) =>
                setExpirationDates({ ...expirationDates, [product.code]: e.target.value })
              }
            />

            {/* Quantity */}
            <label>Quantity:</label>
            <input className={styles.smallInput}
              type="number"
              min={1}
              value={product.quantity}
              onChange={(e) => {
                const qty = parseInt(e.target.value, 10);
                setProducts(prev => prev.map(p => p.code === product.code ? { ...p, quantity: qty } : p));
              }}
              
            />

            {/* Unit */}
            <label>Unit:</label>
            <select className={styles.select}
              type="string"
              value={product.unit}
              onChange={(e) =>
                setProducts(prev => prev.map(p => p.code === product.code ? { ...p, unit: e.target.value } : p))
              }
            >
              <option value="items">Items</option>
              <option value="cases">Cases</option>
            </select>

            <button className={styles.button}
              onClick={() => saveProduct(product)}
              
            >
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
