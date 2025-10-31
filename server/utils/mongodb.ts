import {MongoClient} from 'mongodb';


const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const dbName = process.env.MONGODB_DB || 'miUltralink'

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor agrega MONGODB_URI en .env')
}

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usa una variable global para preservar el cliente
  // entre recargas de HMR
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En producción, es mejor no usar una variable global
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function getDatabase() {
  const client = await clientPromise
  return client.db(dbName)
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase()
  return db.collection(collectionName)
}