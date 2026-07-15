import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  role: "ADMIN" | "MAHASISWA";
  nama_lengkap: string;
  nim?: string;
  jenjang?: string;
  program_studi?: string;
  status_pip: "AKTIF" | "DICABUT" | "LULUS";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: ["ADMIN", "MAHASISWA"],
      default: "MAHASISWA",
      required: true,
    },
    nama_lengkap: {
      type: String,
      required: true,
    },
    nim: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple users without nim to coexist
    },
    jenjang: {
      type: String,
    },
    program_studi: {
      type: String,
    },
    status_pip: {
      type: String,
      enum: ["AKTIF", "DICABUT", "LULUS"],
      default: "AKTIF",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
