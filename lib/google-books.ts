// Tipos para la respuesta de Google Books API
export interface GoogleBookVolume {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    publishedDate?: string
    description?: string
    categories?: string[]
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    industryIdentifiers?: Array<{
      type: string
      identifier: string
    }>
    pageCount?: number
    publisher?: string
    language?: string
  }
}

export interface GoogleBooksResponse {
  items?: GoogleBookVolume[]
  totalItems: number
  kind: string
}

// Función para buscar libros por título y/o autor
export async function searchBooks(query: string): Promise<GoogleBookVolume[]> {
  try {
    // Codificar la consulta para URL
    const encodedQuery = encodeURIComponent(query)

    // Realizar la petición a la API
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&maxResults=5`)

    if (!response.ok) {
      throw new Error(`Error en la búsqueda: ${response.statusText}`)
    }

    const data: GoogleBooksResponse = await response.json()

    // Devolver los resultados o un array vacío si no hay items
    return data.items || []
  } catch (error) {
    console.error("Error al buscar libros:", error)
    return []
  }
}

// Función para obtener detalles de un libro por su ID
export async function getBookDetails(bookId: string): Promise<GoogleBookVolume | null> {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)

    if (!response.ok) {
      throw new Error(`Error al obtener detalles: ${response.statusText}`)
    }

    const data: GoogleBookVolume = await response.json()
    return data
  } catch (error) {
    console.error("Error al obtener detalles del libro:", error)
    return null
  }
}

// Función para extraer información relevante de un volumen de Google Books
export function extractBookInfo(volume: GoogleBookVolume) {
  const { volumeInfo } = volume

  return {
    title: volumeInfo.title || "",
    author: volumeInfo.authors ? volumeInfo.authors.join(", ") : "",
    publishedDate: volumeInfo.publishedDate || "",
    description: volumeInfo.description || "",
    categories: volumeInfo.categories || [],
    thumbnail: volumeInfo.imageLinks?.thumbnail || "",
    pageCount: volumeInfo.pageCount || 0,
    publisher: volumeInfo.publisher || "",
    isbn:
      volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier ||
      volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10")?.identifier ||
      "",
  }
}
