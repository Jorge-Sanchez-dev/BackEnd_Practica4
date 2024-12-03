import { OptionalId } from "mongodb";

export type PartModel = OptionalId<{
  name: string;
  price: number;
  vehicleId: string;
}>;

export type Part = {
  id: string;
  name: string;
  price: number;
  vehicleId: string;
};

export type VehicleModel = OptionalId<{
  name: string;
  manufacturer: string;
  year: number;
}>;

export type Vehicle = {
  id: string;
  name: string;
  manufacturer: string;
  year: number;
  joke: string; // Campo para el chiste
  parts: Part[]; // Array de partes asociadas al vehículo
};