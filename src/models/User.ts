import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  role: "ADMIN" | "MAHASISWA";
  nama_lengkap: string;
  username?: string; // used for ADMIN
  password?: string;
  isPasswordChanged?: boolean; // track if user changed password
  nim?: string;
  jenjang?: string;
  program_studi?: string;
  angkatan?: string;
  nik?: string;
  no_hp?: string;
  status_pip: "AKTIF" | "DICABUT" | "LULUS";
  bp?: number;
  bh?: number;
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
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
    },
    isPasswordChanged: {
      type: Boolean,
      default: false,
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
    angkatan: {
      type: String,
    },
    nik: {
      type: String,
    },
    no_hp: {
      type: String,
    },
    status_pip: {
      type: String,
      enum: ["AKTIF", "DICABUT", "LULUS"],
      default: "AKTIF",
      required: true,
    },
    bp: {
      type: Number,
      default: 0,
    },
    bh: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
