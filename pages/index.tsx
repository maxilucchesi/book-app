"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import Link from "next/link"
import styles from "../styles/Home.module.css"

export default function Home() {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>{error.message}</div>

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Bienvenido a <a href="https://nextjs.org">Next.js con Auth0!</a>
        </h1>

        <div className={styles.grid}>
          {user ? (
            <div className={styles.card}>
              <h2>Usuario autenticado</h2>
              <div>
                <img src={user.picture || ""} alt={user.name || ""} width={100} height={100} />
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
              <div className={styles.buttonContainer}>
                <Link href="/dashboard">
                  <a className={styles.button}>Ir al Dashboard</a>
                </Link>
                <Link href="/api/auth/logout">
                  <a className={styles.button}>Cerrar sesión</a>
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.card}>
              <h2>No has iniciado sesión</h2>
              <Link href="/api/auth/login">
                <a className={styles.button}>Iniciar sesión</a>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

