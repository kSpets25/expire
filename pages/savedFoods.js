// pages/savedFoods.js
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import useLogout from "../hooks/useLogout";
import { useEffect, useState } from "react";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    const props = {};
    if (user) {
      props.user = req.session.user;
      props.isLoggedIn = true;
    } else {
      props.isLoggedIn = false;
    }
    return { props };
  },
  sessionOptions
);

export default function SavedFoods(props) {
  const router = useRouter();
  const logout = useLogout();
  const [savedProducts, setSavedProducts] = useState([]);

  // Load saved products from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedProducts")) || [];
    setSavedProducts(saved);
  }, []);

  // Remove a product
  const removeProduct = (code) => {
    const filtered = savedProducts.filter((p) => p.code !== code);
    localStorage.setItem("savedProducts", JSON.stringify(filtered));
    setSavedProducts(filtered);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Saved Foods</title>
        <meta name="description" content="View your saved foods" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header
        isLoggedIn={props.isLoggedIn}
        username={props?.user?.username}
        onLogout={logout}
      />

      <main className={styles.main}>
        <h1 className={styles.title}>Saved Foods</h1>

        {savedProducts.length === 0 ? (
          <p>You have no saved foods yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
              width: "100%",
              marginTop: "1rem",
            }}
          >
            {savedProducts.map((product) => (
              <div
                key={product.code}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {product.image_small_url && (
                  <img
                    src={product.image_small_url}
                    alt={product.product_name}
                    style={{
                      width: "100%",
                      borderRadius: "4px",
                      marginBottom: "0.5rem",
                    }}
                  />
                )}

                <h3>{product.product_name}</h3>
                <p>Brand: {product.brands || "Unknown"}</p>
                <p>Barcode: {product.code}</p>
                <p>Expiration Date: {product.expirationDate}</p>
                <p>Saved At: {new Date(product.savedAt).toLocaleString()}</p>

                <button
                  onClick={() => removeProduct(product.code)}
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#F44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

