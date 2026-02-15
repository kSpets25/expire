// pages/savedFoods.js
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/savedFoods.module.css";
import Header from "../components/header";
import Footer from "../components/footer";
import useLogout from "../hooks/useLogout";
import dbConnect from "../db/connection";
import Food from "../db/models/foods";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: { destination: "/login", permanent: false },
      };
    }

    await dbConnect();

    const foods = await Food.find({ userId: user.id || user._id }).lean();

    return {
      props: {
        user,
        isLoggedIn: true,
        foods: JSON.parse(JSON.stringify(foods)), // serialize dates for Next.js
      },
    };
  },
  sessionOptions
);

export default function SavedFoods({ foods, user, isLoggedIn }) {
  const router = useRouter();
  const logout = useLogout();

  // Remove product (delete from DB)
  const removeProduct = async (id) => {
    try {
      const res = await fetch(`/api/foods/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      router.replace(router.asPath); // refresh page
    } catch (err) {
      console.error(err);
      alert("Error removing food: " + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Saved Foods</title>
        <meta name="description" content="View your saved foods" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isLoggedIn={isLoggedIn} username={user?.username} onLogout={logout} />

      <main className={styles.main}>
        <h1 className={styles.title}>Saved Foods</h1>

        {foods.length === 0 ? (
          <p>You have no saved foods yet.</p>
        ) : (
          <div className={styles.savedGrid}
            
          >
            {foods.map((food) => (
              <div className={styles.savedCard}
                key={food._id}
                
              >
                {food.image_small_url && (
                  <img className={styles.savedImmage}
                    src={food.image_small_url}
                    alt={food.product_name}
                    
                  />
                )}

                <h3>{food.product_name}</h3>
                <p>Brand: {food.brands || "Unknown"}</p>
                <p>Quantity: {food.quantity} {food.unit}</p>
                <p>Expiration Date: {new Date(food.expirationDate).toLocaleDateString()}</p>
                <p>Saved At: {new Date(food.createdAt).toLocaleString()}</p>

                <button className={styles.removeButton}
                  onClick={() => removeProduct(food._id)}
                  
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer className={styles.footer}/>
    </div>
  );
}
