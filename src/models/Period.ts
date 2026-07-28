import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPeriod extends Document {
  name: string; // e.g., "2026/2027"
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PeriodSchema = new Schema<IPeriod>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Period: Model<IPeriod> = mongoose.models.Period || mongoose.model<IPeriod>("Period", PeriodSchema);
