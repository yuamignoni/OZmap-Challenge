import axios from "axios";

class GeoLib {
  public async getAddressFromCoordinates(
    coordinates: [number, number] | { lat: number; lng: number }
  ): Promise<string> {
    const lat = Array.isArray(coordinates) ? coordinates[0] : coordinates.lat;
    const lng = Array.isArray(coordinates) ? coordinates[1] : coordinates.lng;

    const response = await axios.get(
      `${process.env.GOOGLE_MAPS_API_URL}latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status !== "OK") {
      throw new Error("Failed to get address from coordinates");
    }

    return response.data.results[0].formatted_address;
  }

  public async getCoordinatesFromAddress(
    address: string
  ): Promise<[number, number]> {
    const response = await axios.get(
      `${process.env.GOOGLE_MAPS_API_URL}address=${address}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    const { results } = response.data;
    if (results && results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      return [lat, lng];
    }
    return [0, 0];
  }
}

export default new GeoLib();
