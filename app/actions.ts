"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase"
import { getUserId } from "@/lib/simple-auth"
import { getLocalBooks, syncLocalBooks } from "@/lib/local-storage"
import { testSupabaseConnection, checkUserId } from "@/lib/supabase-debug"

// Función para revalidar todas las rutas relacionadas con libros
export async function revalidateBookPages() {
  try {
    revalidatePath("/dashboard")
    revalidatePath("/books")
    revalidatePath("/favorites")
    console.log("Rutas revalidadas con éxito")
  } catch (error) {
    console.error("Error al revalidar rutas:", error)
  }
}

// Mejorar la función createBookAction para asegurar que el libro se guarde correctamente
export async function createBookAction(book: any) {
  console.log("Iniciando createBookAction con datos:", JSON.stringify(book, null, 2))

  try {
    // Validar datos del libro
    if (!book.title || !book.title.trim()) {
      throw new Error("El título del libro es obligatorio")
    }

    if (!book.author || !book.author.trim()) {
      throw new Error("El autor del libro es obligatorio")
    }

    // Verificar la conexión a Supabase antes de continuar
    const connectionTest = await testSupabaseConnection()
    console.log("Resultado de prueba de conexión:", connectionTest)

    if (!connectionTest.success) {
      console.error("Problema de conexión con Supabase:", connectionTest.error)
      // Continuamos para guardar en localStorage, pero registramos el error
    }

    // Obtener el ID de usuario
    const userIdCheck = await checkUserId()
    console.log("Verificación de ID de usuario:", userIdCheck)

    const userId = getUserId()
    console.log("ID de usuario para el nuevo libro:", userId)

    // Sanitizar datos para asegurar que los campos opcionales sean null y no undefined
    const sanitizedBook = {
      title: book.title.trim(),
      author: book.author.trim(),
      type: book.type,
      rating: book.rating || null,
      date_finished: book.date_finished || null,
      review: book.review ? book.review.trim() : null,
      user_id: userId,
      local_id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      pending_sync: true,
      created_at: new Date().toISOString(),
    }

    console.log("Datos sanitizados:", JSON.stringify(sanitizedBook, null, 2))

    // Guardar el libro en localStorage (modo offline-first)
    // Nota: Esta parte no funcionará en el servidor, solo en el cliente
    console.log("Intentando guardar en localStorage...")

    // Crear una función para guardar en localStorage que se ejecutará en el cliente
    const clientSideCode = `
      try {
        const book = ${JSON.stringify(sanitizedBook)};
        const books = JSON.parse(localStorage.getItem("giuli-books") || "[]");
        books.push(book);
        localStorage.setItem("giuli-books", JSON.stringify(books));
        console.log("Libro guardado en localStorage desde el cliente:", book);
        
        // Disparar evento de actualización
        window.dispatchEvent(new CustomEvent("booksUpdated", { detail: books }));
      } catch (error) {
        console.error("Error al guardar en localStorage desde el cliente:", error);
      }
    `

    // Intentar guardar en Supabase
    let supabaseSuccess = false
    try {
      const supabase = createClient()

      console.log("Intentando insertar en Supabase con cliente:", supabase)

      const { data, error } = await supabase
        .from("books")
        .insert([
          {
            title: sanitizedBook.title,
            author: sanitizedBook.author,
            type: sanitizedBook.type,
            rating: sanitizedBook.rating,
            date_finished: sanitizedBook.date_finished,
            review: sanitizedBook.review,
            user_id: sanitizedBook.user_id,
            local_id: sanitizedBook.local_id,
          },
        ])
        .select()

      if (error) {
        console.error("Error al crear libro en Supabase:", error)
        // No lanzamos error aquí, continuamos con el flujo
      } else {
        console.log("Libro creado con éxito en Supabase:", data)
        supabaseSuccess = true

        // Actualizar el código del cliente para marcar como sincronizado
        if (data && data.length > 0) {
          const clientSideUpdateCode = `
            try {
              const books = JSON.parse(localStorage.getItem("giuli-books") || "[]");
              const index = books.findIndex(b => b.local_id === "${sanitizedBook.local_id}");
              if (index >= 0) {
                books[index] = {...books[index], id: "${data[0].id}", pending_sync: false};
                localStorage.setItem("giuli-books", JSON.stringify(books));
                console.log("Libro actualizado en localStorage con ID de Supabase:", books[index]);
              }
            } catch (error) {
              console.error("Error al actualizar libro en localStorage:", error);
            }
          `
        }
      }
    } catch (supabaseError) {
      console.error("Error al conectar con Supabase:", supabaseError)
      // No lanzamos error aquí, continuamos con el flujo
    }

    // Revalidar rutas después de la inserción
    await revalidateBookPages()

    // Devolver resultado antes de la redirección
    return {
      success: true,
      supabaseSuccess,
      book: sanitizedBook,
      clientSideCode, // Incluir el código para ejecutar en el cliente
      message: supabaseSuccess
        ? "Libro guardado en Supabase y localmente"
        : "Libro guardado localmente, pendiente de sincronización",
    }
  } catch (error) {
    console.error("Error en createBookAction:", error)
    throw error
  }
}

// Actualizar un libro existente (Server Action)
export async function updateBookAction(id: string, updates: any) {
  console.log("Iniciando updateBookAction con datos:", JSON.stringify({ id, updates }, null, 2))

  try {
    // Validar datos del libro
    if (updates.title !== undefined && !updates.title.trim()) {
      throw new Error("El título del libro es obligatorio")
    }

    if (updates.author !== undefined && !updates.author.trim()) {
      throw new Error("El autor del libro es obligatorio")
    }

    // Verificar la conexión a Supabase antes de continuar
    const connectionTest = await testSupabaseConnection()
    console.log("Resultado de prueba de conexión:", connectionTest)

    if (!connectionTest.success) {
      console.error("Problema de conexión con Supabase:", connectionTest.error)
      // Continuamos para guardar en localStorage, pero registramos el error
    }

    // Sanitizar datos para asegurar que los campos opcionales sean null y no undefined
    const sanitizedUpdates: any = {}

    if (updates.title !== undefined) sanitizedUpdates.title = updates.title.trim()
    if (updates.author !== undefined) sanitizedUpdates.author = updates.author.trim()
    if (updates.type !== undefined) sanitizedUpdates.type = updates.type
    if (updates.rating !== undefined) sanitizedUpdates.rating = updates.rating || null
    if (updates.date_finished !== undefined) sanitizedUpdates.date_finished = updates.date_finished || null
    if (updates.review !== undefined) sanitizedUpdates.review = updates.review ? updates.review.trim() : null
    sanitizedUpdates.pending_sync = true

    console.log("Datos sanitizados:", JSON.stringify(sanitizedUpdates, null, 2))

    // Actualizar en localStorage primero
    if (typeof window !== "undefined") {
      const localBooks = getLocalBooks()
      const bookIndex = localBooks.findIndex((b) => b.id === id || b.local_id === id)
      const supabaseSuccess = false

      if (bookIndex !== -1) {
        const updatedBook = { ...localBooks[bookIndex], ...sanitizedUpdates }
        localBooks[bookIndex] = updatedBook
        localStorage.setItem("giuli-books", JSON.stringify(localBooks))
      }
    }

    // Intentar actualizar en Supabase
    let supabaseSuccess = false
    try {
      const supabase = createClient()
      const userId = getUserId()
      const { data, error } = await supabase
        .from("books")
        .update(sanitizedUpdates)
        .eq("id", id)
        .eq("user_id", userId)
        .select()

      if (error) {
        console.error("Error al actualizar libro en Supabase:", error)
        // No lanzamos error aquí, continuamos con el flujo
      } else {
        console.log("Libro actualizado con éxito en Supabase:", data)
        // Actualizar el estado de sincronización en localStorage
        if (typeof window !== "undefined") {
          const localBooks = getLocalBooks()
          const bookIndex = localBooks.findIndex((b) => b.id === id || b.local_id === id)
          if (bookIndex !== -1) {
            localBooks[bookIndex].pending_sync = false
            localStorage.setItem("giuli-books", JSON.stringify(localBooks))
          }
        }
        supabaseSuccess = true
      }
    } catch (supabaseError) {
      console.error("Error al conectar con Supabase:", supabaseError)
      // No lanzamos error aquí, continuamos con el flujo
    }

    // Revalidar rutas después de la actualización
    await revalidateBookPages()

    // Devolver resultado antes de la redirección
    return {
      success: true,
      supabaseSuccess,
      bookId: id,
      message: supabaseSuccess
        ? "Libro actualizado en Supabase y localmente"
        : "Libro actualizado localmente, pendiente de sincronización",
    }
  } catch (error) {
    console.error("Error en updateBookAction:", error)
    throw error
  }
}

// Eliminar un libro (Server Action)
export async function deleteBookAction(id: string) {
  console.log("Iniciando deleteBookAction para libro ID:", id)

  try {
    // Verificar la conexión a Supabase antes de continuar
    const connectionTest = await testSupabaseConnection()
    console.log("Resultado de prueba de conexión:", connectionTest)

    if (!connectionTest.success) {
      console.error("Problema de conexión con Supabase:", connectionTest.error)
      // Continuamos para eliminar en localStorage, pero registramos el error
    }

    // Eliminar de localStorage primero
    if (typeof window !== "undefined") {
      const localBooks = getLocalBooks()
      const filteredBooks = localBooks.filter((b) => b.id !== id && b.local_id !== id)
      localStorage.setItem("giuli-books", JSON.stringify(filteredBooks))

      // Disparar evento de actualización
      if (typeof window.dispatchEvent === "function") {
        window.dispatchEvent(new CustomEvent("booksUpdated", { detail: { action: "delete", id } }))
      }
    }

    let supabaseSuccess = false

    // Intentar eliminar de Supabase
    try {
      const supabase = createClient()
      const userId = getUserId()

      // Imprimir información de depuración
      console.log("Intentando eliminar libro con ID:", id)
      console.log("Usuario ID:", userId)

      // Primero verificar si el libro existe
      const { data: bookData, error: bookError } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .single()

      if (bookError) {
        console.error("Error al buscar el libro para eliminar:", bookError)
        throw new Error(`No se pudo encontrar el libro: ${bookError.message}`)
      }

      if (!bookData) {
        console.error("El libro no existe o no pertenece al usuario")
        throw new Error("El libro no existe o no pertenece al usuario")
      }

      // Ahora intentar eliminar
      const { error } = await supabase.from("books").delete().eq("id", id).eq("user_id", userId)

      if (error) {
        console.error("Error al eliminar libro en Supabase:", error)
        throw new Error(`Error al eliminar: ${error.message}`)
      } else {
        console.log("Libro eliminado con éxito de Supabase")
        supabaseSuccess = true
      }
    } catch (supabaseError) {
      console.error("Error al conectar con Supabase:", supabaseError)
      throw supabaseError
    }

    // Revalidar rutas después de la eliminación
    await revalidateBookPages()

    // Devolver resultado antes de la redirección
    return {
      success: true,
      supabaseSuccess,
      bookId: id,
      message: supabaseSuccess ? "Libro eliminado de Supabase y localmente" : "Libro eliminado localmente",
    }
  } catch (error) {
    console.error("Error en deleteBookAction:", error)
    throw error
  }
}

// Sincronizar libros pendientes con Supabase
export async function syncPendingBooksAction() {
  try {
    // Verificar la conexión a Supabase antes de continuar
    const connectionTest = await testSupabaseConnection()
    console.log("Resultado de prueba de conexión:", connectionTest)

    if (!connectionTest.success) {
      return {
        success: false,
        message: "No se pudo conectar con Supabase",
        details: connectionTest.error,
      }
    }

    const result = await syncLocalBooks()
    await revalidateBookPages()
    return {
      success: true,
      message: "Sincronización completada",
      details: result,
    }
  } catch (error) {
    console.error("Error al sincronizar libros:", error)
    return {
      success: false,
      message: "Error al sincronizar",
      details: error,
    }
  }
}
