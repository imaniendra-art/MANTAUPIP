import mongoose from "mongoose";
import { User } from "../src/models/User";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error("Please define the DATABASE_URL environment variable inside .env");
}

async function main() {
  console.log("Connecting to database...");
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  // Clear existing users
  await User.deleteMany({});
  console.log("Cleared existing users");

  // Create Admin
  const admin = await User.create({
    nim: "admin",
    nama_lengkap: "Administrator MANTAU PIP",
    role: "ADMIN",
    status_pip: "AKTIF",
  });
  console.log("Created Admin:", admin.nama_lengkap);

  // Create Student
  const mahasiswa = await User.create({
    nim: "12345678",
    nama_lengkap: "Budi Santoso",
    role: "MAHASISWA",
    jenjang: "S1",
    program_studi: "Manajemen",
    status_pip: "AKTIF",
  });
  console.log("Created Mahasiswa:", mahasiswa.nama_lengkap);

  console.log("Database seeded successfully!");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
