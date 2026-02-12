import Head from "next/head";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import useLogout from "../hooks/useLogout";

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

export default function Home(props) {
  const router = useRouter();
  const logout = useLogout();
  return (
    <div className={styles.container}>
      <Head>
        <title>Food Search App</title>
        <meta
          name="description"
          content="Search for foods and save them with expiration dates"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header with props */}
      <Header
        isLoggedIn={props.isLoggedIn}
        username={props?.user?.username}
        onLogout={logout}
      />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to expire! Your Food Inventory App
        </h1>

        {/* Landing page content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h1>Just Eat It!!</h1>
          <p>Search for foods and save them with expiration dates.</p>
          <button
            onClick={() => {
              if (props.isLoggedIn) {
                router.push("/searchFoods");
              } else { 
                router.push("/login");
              }
            }}
            style={{
              padding: "1rem 2rem",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              marginTop: "1rem",
            }}
          >
            Search Foods
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
        {/* Footer content */}
      </footer>
    </div>
  );
}