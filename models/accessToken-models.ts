import {Schema, model} from 'mongoose';


export interface aToken {
  user: string,
  accessToken?: string,
}

const schema = new Schema<aToken>({
  user: {type: Schema.Types.ObjectId, ref: 'Users'},
  accessToken: {type: String, required: true},
});

export const aTokenModel = model<aToken>('aTokens', schema);
