import styles from "./style.module.css";
import Link from "next/link";
import useLogout from "../../hooks/useLogout";
import Image from "next/image";

export default function Header(props) {
  const logout = useLogout();
  return (
    <header className={styles.container}>
      {props.isLoggedIn ? (
        <>
          <p className={styles.navigation}> 
          <Link href="/">Home</Link>
          
          <Link href="/searchFoods">Search</Link>
          <Link href="/savedFoods">Saved</Link>
          <Link href="/expiringFoods">Expiring</Link>
          </p>
          <div className={styles.container1}>
            <p>Welcome, {props.username}!</p>
            <p onClick={logout} style={{ cursor: "pointer" }}>
              Logout
            </p>
          </div>
        </>
      ) : (
        <>
          <p>
            <Link href="/">Home</Link>
          </p>
          <p>
            <Link href="/login">Login</Link>
          </p>
        </>
      )}
    </header>
  );
}

