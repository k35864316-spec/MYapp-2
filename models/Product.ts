import { model, models, Schema, type Model } from 'mongoose';

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    likes: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  },
);

export const Product: Model<any> =
  models.Product || model('Product', productSchema);
