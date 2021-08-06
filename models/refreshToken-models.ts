import {Schema, model} from 'mongoose';


export interface rToken {
  user: string,
  refreshToken?: string,
}

const schema = new Schema<rToken>({
  user: {type: Schema.Types.ObjectId, ref: 'Users'},
  refreshToken: {type: String, required: true},
});

export const rTokenModel = model<rToken>('rTokens', schema);
