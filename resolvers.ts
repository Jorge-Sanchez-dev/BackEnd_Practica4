import { Collection, ObjectId } from "mongodb";
import { Vehicle, VehicleModel, Part, PartModel } from "./types.ts";
import { formModelToVehicle, formModelToPart } from "./utils.ts";

export const resolvers = {
  Query: {
    vehicles: async (
      _: unknown,
      __: unknown,
      context: { VehiclesCollection: Collection<VehicleModel> }
    ): Promise<Vehicle[]> => {
      const vehicleModels = await context.VehiclesCollection.find().toArray();
      return vehicleModels.map(formModelToVehicle);
    },
    vehicle: async (
      _: unknown,
      { id }: { id: string },
      context: { VehiclesCollection: Collection<VehicleModel> }
    ): Promise<Vehicle | null> => {
      const vehicleModel = await context.VehiclesCollection.findOne({ _id: new ObjectId(id) });
      return vehicleModel ? formModelToVehicle(vehicleModel) : null;
    },
    partsByVehicle: async (
      _: unknown,
      { vehicleId }: { vehicleId: string },
      context: { PartsCollection: Collection<PartModel> }
    ): Promise<Part[]> => {
      const partModels = await context.PartsCollection.find({ vehicleId }).toArray();
      return partModels.map(formModelToPart);
    },
  },
  Mutation: {
    addVehicle: async (
      _: unknown,
      { name, manufacturer, year }: { name: string; manufacturer: string; year: number },
      context: { VehiclesCollection: Collection<VehicleModel> }
    ): Promise<Vehicle> => {
      const { insertedId } = await context.VehiclesCollection.insertOne({ name, manufacturer, year });
      return formModelToVehicle({ _id: insertedId, name, manufacturer, year });
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
      return partModel ? formModelToPart(partModel.value!) : null;
    },
  },
};