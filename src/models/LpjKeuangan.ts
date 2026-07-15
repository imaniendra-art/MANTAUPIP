import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILpjKeuangan extends Document {
  mahasiswa_id: mongoose.Types.ObjectId;
  periode_pencairan: string;
  pakta_integritas: boolean;
  url_bukti_rekening: string;
  status_laporan: "MENUNGGU" | "REVISI" | "DISETUJUI";
  createdAt: Date;
  updatedAt: Date;
}

const LpjKeuanganSchema = new Schema<ILpjKeuangan>(
  {
    mahasiswa_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    periode_pencairan: {
      type: String,
      required: true,
    },
    pakta_integritas: {
      type: Boolean,
      default: false,
    },
    url_bukti_rekening: {
      type: String,
      required: true,
    },
    status_laporan: {
      type: String,
      enum: ["MENUNGGU", "REVISI", "DISETUJUI"],
      default: "MENUNGGU",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const LpjKeuangan: Model<ILpjKeuangan> = 
  mongoose.models.LpjKeuangan || mongoose.model<ILpjKeuangan>("LpjKeuangan", LpjKeuanganSchema);
