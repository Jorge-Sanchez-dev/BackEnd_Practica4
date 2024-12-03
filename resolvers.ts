import { Collection, ObjectId } from "mongodb";
import { Vehicle, VehicleModel, Part, PartModel } from "./types.ts";
import { formModelToVehicle, formModelToPart, fetchJoke } from "./utils.ts";

export const resolvers = {
  Query: {
    vehicles: async (
      _: unknown,
      __: unknown,
      context: { VehiclesCollection: Collection<VehicleModel>; PartsCollection: Collection<PartModel> },
    ): Promise<Vehicle[]> => {
      const vehiclesModel = await context.VehiclesCollection.find().toArray();
      return Promise.all(
        vehiclesModel.map(async (vehicleModel) => {
          const joke = await fetchJoke();
          const partsModel = await context.PartsCollection.find({ vehicleId: vehicleModel._id!.toString() }).toArray();
          const parts = partsModel.map((partModel) => formModelToPart(partModel));
          return formModelToVehicle(vehicleModel, parts, joke);
        }),
      );
    },
    vehicle: async (
      _: unknown,
      { id }: { id: string },
      context: { VehiclesCollection: Collection<VehicleModel>; PartsCollection: Collection<PartModel> },
    ): Promise<Vehicle | null> => {
      const vehicleModel = await context.VehiclesCollection.findOne({ _id: new ObjectId(id) });
      if (!vehicleModel) return null;

      const joke = await fetchJoke();
      const partsModel = await context.PartsCollection.find({ vehicleId: id }).toArray();
      const parts = partsModel.map((partModel) => formModelToPart(partModel));

      return formModelToVehicle(vehicleModel, parts, joke);
    },
    parts: async (
      _: unknown,
      __: unknown,
      context: { PartsCollection: Collection<PartModel> },
    ): Promise<Part[]> => {
      const partsModel = await context.PartsCollection.find().toArray();
      return partsModel.map((partModel) => formModelToPart(partModel));
    },
    vehiclesByManufacturer: async (
      _: unknown,
      { manufacturer }: { manufacturer: string },
      context: { VehiclesCollection: Collection<VehicleModel> },
    ): Promise<Vehicle[]> => {
      const vehiclesModel = await context.VehiclesCollection.find({ manufacturer }).toArray();
      return Promise.all(
        vehiclesModel.map(async (vehicleModel) => {
          const joke = await fetchJoke();
          return formModelToVehicle(vehicleModel, [], joke);
        }),
      );
    },
    partsByVehicle: async (
      _: unknown,
      { vehicleId }: { vehicleId: string },
      context: { PartsCollection: Collection<PartModel> },
    ): Promise<Part[]> => {
      const partsModel = await context.PartsCollection.find({ vehicleId }).toArray();
      return partsModel.map((partModel) => formModelToPart(partModel));
    },
    vehiclesByYearRange: async (
      _: unknown,
      { startYear, endYear }: { startYear: number; endYear: number },
      context: { VehiclesCollection: Collection<VehicleModel> },
    ): Promise<Vehicle[]> => {
      const vehiclesModel = await context.VehiclesCollection.find({
        year: { $gte: startYear, $lte: endYear },
      }).toArray();
      return Promise.all(
        vehiclesModel.map(async (vehicleModel) => {
          const joke = await fetchJoke();
          return formModelToVehicle(vehicleModel, [], joke);
        }),
      );
    },
  },
  Mutation: {
    addVehicle: async (
      _: unknown,
      { name, manufacturer, year }: { name: string; manufacturer: string; year: number },
      context: { VehiclesCollection: Collection<VehicleModel> },
    ): Promise<Vehicle> => {
      const { insertedId } = await context.VehiclesCollection.insertOne({ name, manufacturer, year });
      return formModelToVehicle({ _id: insertedId, name, manufacturer, year }, [], "");
    },
    addPart: async (
      _: unknown,
      { name, price, vehicleId }: { name: string; price: number; vehicleId: string },
      context: { PartsCollection: Collection<PartModel> },
    ): Promise<Part> => {
      const { insertedId } = await context.PartsCollection.insertOne({ name, price, vehicleId });
      return formModelToPart({ _id: insertedId, name, price, vehicleId });
    },
    deletePart: async (
      _: unknown,
      { id }: { id: string },
      context: { PartsCollection: Collection<PartModel> },
    ): Promise<Part | null> => {
      const partModel = await context.PartsCollection.findOneAndDelete({ _id: new ObjectId(id) });
      return partModel ? formModelToPart(partModel) : null;
    },
    updateVehicle: async (
      _: unknown,
      { id, name, manufacturer, year }: { id: string; name: string; manufacturer: string; year: number },
      context: { VehiclesCollection: Collection<VehicleModel> },
    ): Promise<Vehicle | null> => {
      const result = await context.VehiclesCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { name, manufacturer, year } },
        { returnDocument: "after" },
      );

      if (!result) return null;

      return formModelToVehicle(result, [], ""); // Joke y parts no son necesarios aquí
    },
  },
};