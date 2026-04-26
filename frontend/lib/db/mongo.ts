import { MongoClient, type Db } from "mongodb";

const DB_NAME = "recourse";

declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "MONGO_URI is not configured. Add it to frontend/.env and restart the dev server."
    );
  }
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClient = client;
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(DB_NAME);
}
