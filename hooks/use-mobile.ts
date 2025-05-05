"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Función para verificar si es un dispositivo móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verificar al cargar
    checkMobile()

    // Verificar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkMobile)

    // Limpiar el event listener
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}
