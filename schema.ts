export const schema = `#graphql
type Vehicle {
  id: ID!
  name: String!
  manufacturer: String!
  year: Int!
  parts: [Part!]
}

type Part {
  id: ID!
  name: String!
  price: Float!
  vehicleId: ID!
}

type Query {
  vehicles: [Vehicle!]!
  vehicle(id: ID!): Vehicle
  parts: [Part!]!
  partsByVehicle(vehicleId: ID!): [Part!]
}

type Mutation {
  addVehicle(name: String!, manufacturer: String!, year: Int!): Vehicle!
  addPart(name: String!, price: Float!, vehicleId: ID!): Part!
  deletePart(id: ID!): Part
}

`;