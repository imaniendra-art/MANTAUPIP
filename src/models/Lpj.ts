import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILpj extends Document {
  mahasiswa_id: mongoose.Types.ObjectId;
  semester_berjalan: string;
  data_akademik: any;
  data_non_akademik: any;
  data_biaya_hidup: any;
  data_kondisi_ekonomi: any;
  data_pakta_integritas: any;
  status_laporan: "MENUNGGU" | "REVISI" | "DISETUJUI";
  catatan_revisi?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LpjSchema = new Schema<ILpj>(
  {
    mahasiswa_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    semester_berjalan: {
      type: String,
      required: true,
    },
    data_akademik: {
      type: Schema.Types.Mixed,
    },
    data_non_akademik: {
      type: Schema.Types.Mixed,
    },
    data_biaya_hidup: {
      type: Schema.Types.Mixed,
    },
    data_kondisi_ekonomi: {
      type: Schema.Types.Mixed,
    },
    data_pakta_integritas: {
      type: Schema.Types.Mixed,
    },
    status_laporan: {
      type: String,
      enum: ["MENUNGGU", "REVISI", "DISETUJUI"],
      default: "MENUNGGU",
      required: true,
    },
    catatan_revisi: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export const Lpj: Model<ILpj> = mongoose.models.Lpj || mongoose.model<ILpj>("Lpj", LpjSchema);
