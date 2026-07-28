import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActivityLog extends Document {
  adminName: string;
  adminUsername: string;
  action: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    adminName: {
      type: String,
      required: true,
    },
    adminUsername: {
      type: String,
      required: true,
    },
    action: {
      type: String, // e.g., "CREATE", "UPDATE", "DELETE", "UPLOAD", "LOGIN"
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ActivityLog: Model<IActivityLog> = mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
