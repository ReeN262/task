import {Schema, model} from 'mongoose';


export interface UsersModels {
  id: string,
  phone?: number,
  // eslint-disable-next-line camelcase
  id_type: string,
  email?: string,
  password?: string,
}

const schema = new Schema<UsersModels>({
  phone: {type: Number},
  email: {type: String},
  password: {type: String, required: true},
  id_type: {type: String, default: null},
});

export const UserModel = model<UsersModels>('Users', schema);
