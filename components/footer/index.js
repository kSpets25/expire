import styles from "./style.footer.module.css";
//import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    
    return (
        <footer className={styles.footer}>
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.logo}>
            <Image src="" width={120} height={60} />
          </div>
        </a>
      </footer>
    );
}