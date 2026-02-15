// pages/expiringFoods.js
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/expiringFoods.module.css";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!props.isLoggedIn) return;

    const fetchFoods = async () => {
      try {
        const res = await fetch("/api/foods");
        const data = await res.json();

        if (!data.success) throw new Error(data.message || "Failed to fetch foods");

        const today = new Date();
        const upcoming = data.products.filter((product) => {
          if (!product.expirationDate) return false;
          const expDate = new Date(product.expirationDate);
          const diffDays = (expDate - today) / (1000 * 60 * 60 * 24);
          return diffDays >= 0 && diffDays <= 14;
        });

        setExpiringFoods(upcoming);
      } catch (err) {
        console.error("Error fetching expiring foods:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [props.isLoggedIn]);

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

        {loading ? (
          <p>Loading...</p>
        ) : expiringFoods.length === 0 ? (
          <p>No foods are expiring in the next 14 days.</p>
        ) : (
          <div className={styles.expiringGrid}
            
          >
            {expiringFoods.map((product) => {
              const left = daysLeft(product.expirationDate);
              return (
                <div className={styles.expiringCard}
                  key={product._id}
                  
                >
                  {product.image_small_url && (
                    <img className={styles.savedImage}
                      src={product.image_small_url}
                      alt={product.product_name}
                     
                    />
                  )}

                  <h3>{product.product_name}</h3>
                  <p>Brand: {product.brands || "Unknown"}</p>
                  <p>Barcode: {product.code}</p>
                  <p>Expiration Date: {new Date(product.expirationDate).toLocaleDateString()}</p>
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
       
      </footer>
    </div>
  );
}
