import { Collection, ObjectId } from "mongodb";
import { Vehicle, VehicleModel, Part, PartModel } from "./types.ts";
import { formModelToVehicle, formModelToPart, fetchJoke } from "./utils.ts";

export const resolvers = {
    Query: {
        vehicles: async (
          _: unknown,
          __: unknown,
          context: { VehiclesCollection: Collection<VehicleModel> },
        ): Promise<Vehicle[]> => {
          const vehiclesModel = await context.VehiclesCollection.find().toArray();
          return Promise.all(
            vehiclesModel.map(async (vehicleModel) => {
              const joke = await fetchJoke();
              return { ...formModelToVehicle(vehicleModel, joke)};
            }),
          );
        },
        vehicle: async (
          _: unknown,
          { id }: { id: string },
          context: { VehiclesCollection: Collection<VehicleModel> },
        ): Promise<Vehicle | null> => {
          const vehicleModel = await context.VehiclesCollection.findOne({
            _id: new ObjectId(id),
          });
          if (!vehicleModel) return null;
    
          const joke = await fetchJoke();
          return { ...formModelToVehicle(vehicleModel, joke) };
        },
      },
  Mutation: {
    addVehicle: async (
      _: unknown,
      { name, manufacturer, year }: { name: string; manufacturer: string; year: number },
      context: { VehiclesCollection: Collection<VehicleModel> }
    ): Promise<Vehicle> => {
        
      const { insertedId } = await context.VehiclesCollection.insertOne({ name, manufacturer, year });
      const  joke = " "
      return formModelToVehicle({ _id: insertedId, name, manufacturer, year}, joke);
    },
    addPart: async (
      _: unknown,
      { name, price, vehicleId }: { name: string; price: number; vehicleId: string },
      context: { PartsCollection: Collection<PartModel> }
    ): Promise<Part> => {
      const { insertedId } = await context.PartsCollection.insertOne({ name, price, vehicleId });
      return formModelToPart({ _id: insertedId, name, price, vehicleId });
    },
    deletePart: async (
      _: unknown,
      { id }: { id: string },
      context: { PartsCollection: Collection<PartModel> }
    ): Promise<Part | null> => {
      const partModel = await context.PartsCollection.findOneAndDelete({ _id: new ObjectId(id) });
      return partModel ? formModelToPart(partModel) : null;
    },
  },
};