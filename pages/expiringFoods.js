// pages/expiringFoods.js
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

export default function ExpiringFoods(props) {
  const router = useRouter();
  const logout = useLogout();
  const [expiringFoods, setExpiringFoods] = useState([]);

  useEffect(() => {
    // Get saved products from localStorage
    const savedProducts = JSON.parse(localStorage.getItem("savedProducts")) || [];

    const today = new Date();
    // Filter products expiring in the next 14 days
    const upcoming = savedProducts.filter((product) => {
      if (!product.expirationDate) return false;
      const expDate = new Date(product.expirationDate);
      const diffDays = (expDate - today) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 14;
    });

    setExpiringFoods(upcoming);
  }, []);

  // Calculate days left until expiration
  const daysLeft = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Expiring Foods</title>
        <meta name="description" content="Foods expiring in the next 14 days" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header
        isLoggedIn={props.isLoggedIn}
        username={props?.user?.username}
        onLogout={logout}
      />

      <main className={styles.main}>
        <h1 className={styles.title}>Foods Expiring Soon</h1>

        {expiringFoods.length === 0 ? (
          <p>No foods are expiring in the next 14 days.</p>
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
            {expiringFoods.map((product) => {
              const left = daysLeft(product.expirationDate);
              return (
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
                  <p>
                    Days left: <strong>{left}</strong>{" "}
                    {left === 1 ? "day" : "days"}
                  </p>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: left <= 3 ? "#F44336" : "#FF9800",
                    }}
                  >
                    {left <= 0 ? "Expired!" : `${left} day${left > 1 ? "s" : ""} remaining`}
                  </div>
                </div>
              );
            })}
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
