export interface IUser extends Document {
  name: string;
  email: string;
  address?: string;
  coordinates?: [number, number];
}
