// // scripts/createAdmin.js

// const { PrismaClient } = require("@prisma/client");
// const bcrypt = require("bcryptjs");

// const prisma = new PrismaClient();

// async function main() {
//   const hashedPassword = await bcrypt.hash("Admin@123", 10); // Change this password if needed

//   const adminUser = await prisma.user.create({
//     data: {
//       name: "Admin",
//       email: "admin@gmail.com",
//       password: hashedPassword,
//       role: "ADMIN", // Assuming "ADMIN" is a valid Role enum in your Prisma schema
//       isVerified: true,
//     },
//   });

//   console.log("✅ Admin user created:", adminUser);
// }

// main()
//   .catch((e) => {
//     console.error("❌ Error creating admin user:", e);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
