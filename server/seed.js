import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Article from "./models/Article.js";
import Ticket from "./models/Ticket.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Clearing old data...");
  await User.deleteMany({});
  await Article.deleteMany({});
  await Ticket.deleteMany({});

  console.log("Seeding users...");
  await User.create([
    { email: "admin@test.com", password: "admin123", role: "admin" },
    { email: "agent@test.com", password: "agent123", role: "agent" },
    { email: "user@test.com", password: "user123", role: "user" },
  ]);

  console.log("Seeding KB articles...");
  await Article.create([
    { title: "Reset password", body: "Steps to reset password", tags: ["account"], status: "published" },
    { title: "Billing FAQ", body: "Common billing questions", tags: ["billing"], status: "published" },
  ]);

  console.log("Seeding tickets...");
  await Ticket.create([
    { title: "Need invoice", description: "Please send invoice", status: "open" },
    { title: "Login issue", description: "Can't reset password", status: "open" },
  ]);

  console.log("Seeding complete ✅");
  process.exit();
}

seed();