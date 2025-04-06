import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Link from "next/link"
import styles from "../../styles/Home.module.css"

export default withPageAuthRequired(function Dashboard({ user }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Dashboard</h1>

        <div className={styles.card}>
          <h2>Bienvenido, {user.name}!</h2>
          <p>Email: {user.email}</p>

          <div className={styles.buttonContainer}>
            <Link href="/">
              <a className={styles.button}>Volver al inicio</a>
            </Link>
            <Link href="/api/auth/logout">
              <a className={styles.button}>Cerrar sesión</a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
})

