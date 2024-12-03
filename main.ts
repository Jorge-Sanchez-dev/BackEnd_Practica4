import { ApolloServer } from "@apollo/server";
import { schema } from "./schema.ts";
import { MongoClient } from "mongodb";
import { VehicleModel, PartModel } from "./types.ts";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = "mongodb+srv://jsanchezl5:125343Jj@jorge-nebrija.jwrpu.mongodb.net/?retryWrites=true&w=majority&appName=Jorge-Nebrija"

if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("Jorge-Nebrija");
const VehiclesCollection = mongoDB.collection<VehicleModel>("vehicles");
const PartsCollection = mongoDB.collection<PartModel>("parts");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ VehiclesCollection, PartsCollection }),
});

console.info(`Server ready at ${url}`);