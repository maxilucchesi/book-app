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
      small?: string
      medium?: string
      large?: string
      extraLarge?: string
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

// Función para mejorar la URL de la imagen para obtener mayor resolución
function getHighResImageUrl(url: string | undefined): string {
  if (!url) return ""

  // Reemplazar zoom=1 por zoom=3 para obtener mayor resolución
  if (url.includes("zoom=1")) {
    return url.replace("zoom=1", "zoom=3")
  }

  // Si la URL es de Google Books y no tiene parámetro zoom, añadirlo
  if (url.includes("books.google.com") && !url.includes("zoom=")) {
    return url.includes("?") ? `${url}&zoom=3` : `${url}?zoom=3`
  }

  // Si es una URL de thumbnail estándar, intentar obtener una versión más grande
  if (url.includes("&img=1&")) {
    return url.replace("&img=1&", "&img=2&")
  }

  return url
}

// Función para extraer información relevante de un volumen de Google Books
export function extractBookInfo(volume: GoogleBookVolume) {
  const { volumeInfo } = volume

  // Obtener la mejor imagen disponible
  let thumbnail = ""
  if (volumeInfo.imageLinks) {
    // Intentar obtener la imagen de mayor resolución disponible
    thumbnail =
      volumeInfo.imageLinks.large ||
      volumeInfo.imageLinks.medium ||
      volumeInfo.imageLinks.small ||
      volumeInfo.imageLinks.thumbnail ||
      volumeInfo.imageLinks.smallThumbnail ||
      ""

    // Mejorar la resolución de la URL
    thumbnail = getHighResImageUrl(thumbnail)
  }

  return {
    title: volumeInfo.title || "",
    author: volumeInfo.authors ? volumeInfo.authors.join(", ") : "",
    publishedDate: volumeInfo.publishedDate || "",
    description: volumeInfo.description || "",
    categories: volumeInfo.categories || [],
    thumbnail: thumbnail,
    pageCount: volumeInfo.pageCount || 0,
    publisher: volumeInfo.publisher || "",
    isbn:
      volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier ||
      volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10")?.identifier ||
      "",
  }
}
