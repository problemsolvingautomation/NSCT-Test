import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGO_URI!;

if (!uri) {
  throw new Error("MONGO_URI environment variable is not set");
}

const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30_000,
  serverSelectionTimeoutMS: 5_000,
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const g = globalThis as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!g._mongoClientPromise) {
    g._mongoClientPromise = new MongoClient(uri, options).connect();
  }
  clientPromise = g._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri, options).connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("nsct");
}
