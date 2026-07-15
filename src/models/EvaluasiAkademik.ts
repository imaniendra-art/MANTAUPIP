import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvaluasiAkademik extends Document {
  mahasiswa_id: mongoose.Types.ObjectId;
  semester_berjalan: number;
  ipk_terakhir: number;
  total_sks: number;
  url_dokumen_khs: string;
  createdAt: Date;
  updatedAt: Date;
}

const EvaluasiAkademikSchema = new Schema<IEvaluasiAkademik>(
  {
    mahasiswa_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    semester_berjalan: {
      type: Number,
      required: true,
    },
    ipk_terakhir: {
      type: Number,
      required: true,
    },
    total_sks: {
      type: Number,
      required: true,
    },
    url_dokumen_khs: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const EvaluasiAkademik: Model<IEvaluasiAkademik> = 
  mongoose.models.EvaluasiAkademik || mongoose.model<IEvaluasiAkademik>("EvaluasiAkademik", EvaluasiAkademikSchema);
