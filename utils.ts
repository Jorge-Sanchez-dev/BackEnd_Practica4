import { Vehicle, VehicleModel, Part, PartModel } from "./types.ts";

export const formModelToVehicle = (vehicleModel: VehicleModel): Vehicle => ({
  id: vehicleModel._id!.toString(),
  name: vehicleModel.name,
  manufacturer: vehicleModel.manufacturer,
  year: vehicleModel.year,
});

export const formModelToPart = (partModel: PartModel): Part => ({
  id: partModel._id!.toString(),
  name: partModel.name,
  price: partModel.price,
  vehicleId: partModel.vehicleId,
});