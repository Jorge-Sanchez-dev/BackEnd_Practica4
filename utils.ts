import { Vehicle, VehicleModel, Part, PartModel } from "./types.ts";

export const formModelToVehicle = (
    vehicleModel: VehicleModel,
    parts: Part[] = [], // Campo parts, vacío por 
    joke: string
  ): Vehicle => {
    return {
      id: vehicleModel._id!.toString(),
      name: vehicleModel.name,
      manufacturer: vehicleModel.manufacturer,
      year: vehicleModel.year,
      joke: joke, // Este campo será llenado en los resolvers
      parts, // Agregar las partes asociadas
    };
  };

export const formModelToPart = (partModel: PartModel): Part => ({
  id: partModel._id!.toString(),
  name: partModel.name,
  price: partModel.price,
  vehicleId: partModel.vehicleId,
});

export const fetchJoke = async (): Promise<string> => {
    const response = await fetch("https://official-joke-api.appspot.com/random_joke");
    if (!response.ok) {
      console.error("Error fetching joke:", response.statusText);
      return "No joke available at the moment.";
    }
    const jokeData = await response.json();
    return `${jokeData.setup} ${jokeData.punchline}`;
  };