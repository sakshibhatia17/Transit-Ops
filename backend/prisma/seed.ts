import { Role } from "@prisma/client";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/utils/password.js";

async function main() {
  console.log("🌱 Seeding database...");

  // -----------------------------
  // Admin User
  // -----------------------------
  const hashedPassword = await hashPassword("password123");

  const admin = await prisma.user.upsert({
    where: {
      email: "sakshi@test.com",
    },
    update: {},
    create: {
      name: "Sakshi",
      email: "sakshi@test.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Admin created:", admin.email);
    // -----------------------------
  // Vehicles
  // -----------------------------
  await prisma.vehicle.deleteMany();

  const vehicles = await prisma.vehicle.createMany({
    data: [
      {
        registrationNo: "MP20AB1234",
        model: "Tata Prima 5530",
        type: "Truck",
        maxLoadCapacity: 5000,
        odometer: 120450,
        acquisitionCost: 4200000,
        status: "AVAILABLE",
      },
      {
        registrationNo: "MP20CD5678",
        model: "Ashok Leyland 2820",
        type: "Truck",
        maxLoadCapacity: 6000,
        odometer: 98500,
        acquisitionCost: 4500000,
        status: "ON_TRIP",
      },
      {
        registrationNo: "MP20EF9012",
        model: "Mahindra Blazo X",
        type: "Truck",
        maxLoadCapacity: 4500,
        odometer: 75320,
        acquisitionCost: 3800000,
        status: "AVAILABLE",
      },
      {
        registrationNo: "MP20GH3456",
        model: "Eicher Pro 3015",
        type: "Mini Truck",
        maxLoadCapacity: 2500,
        odometer: 50340,
        acquisitionCost: 2200000,
        status: "IN_SHOP",
      },
      {
        registrationNo: "MP20IJ7890",
        model: "Mahindra Furio",
        type: "Truck",
        maxLoadCapacity: 5500,
        odometer: 132000,
        acquisitionCost: 4700000,
        status: "AVAILABLE",
      },
    ],
  });

  console.log("✅ Vehicles created");
    // -----------------------------
  // Drivers
  // -----------------------------
  await prisma.driver.deleteMany();

  await prisma.driver.createMany({
    data: [
      {
        name: "Rahul Sharma",
        licenseNumber: "DL123456789",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2028-05-10"),
        contactNumber: "9876543210",
        safetyScore: 96,
        status: "AVAILABLE",
      },
      {
        name: "Amit Verma",
        licenseNumber: "DL987654321",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2027-11-21"),
        contactNumber: "9876543211",
        safetyScore: 91,
        status: "ON_TRIP",
      },
      {
        name: "Rakesh Patel",
        licenseNumber: "DL456789123",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2029-03-18"),
        contactNumber: "9876543212",
        safetyScore: 98,
        status: "AVAILABLE",
      },
      {
        name: "Suresh Yadav",
        licenseNumber: "DL321654987",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2026-12-15"),
        contactNumber: "9876543213",
        safetyScore: 89,
        status: "OFF_DUTY",
      },
      {
        name: "Vikram Singh",
        licenseNumber: "DL741852963",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2028-08-30"),
        contactNumber: "9876543214",
        safetyScore: 94,
        status: "AVAILABLE",
      },
    ],
  });

  console.log("✅ Drivers created");
    // -----------------------------
  // Trips
  // -----------------------------
  await prisma.trip.deleteMany();

  const vehicleList = await prisma.vehicle.findMany({
    orderBy: { registrationNo: "asc" },
  });

  const driverList = await prisma.driver.findMany({
    orderBy: { name: "asc" },
  });

  await prisma.trip.createMany({
    data: [
      {
        source: "Jabalpur",
        destination: "Bhopal",
        cargoWeight: 3200,
        plannedDistance: 340,
        actualDistance: 338,
        fuelConsumed: 48,
        status: "COMPLETED",
        vehicleId: vehicleList[0].id,
        driverId: driverList[0].id,
      },
      {
        source: "Indore",
        destination: "Nagpur",
        cargoWeight: 4200,
        plannedDistance: 450,
        status: "DISPATCHED",
        vehicleId: vehicleList[1].id,
        driverId: driverList[1].id,
      },
      {
        source: "Bhopal",
        destination: "Raipur",
        cargoWeight: 2800,
        plannedDistance: 520,
        status: "DRAFT",
        vehicleId: vehicleList[2].id,
        driverId: driverList[2].id,
      },
      {
        source: "Jabalpur",
        destination: "Sagar",
        cargoWeight: 1500,
        plannedDistance: 180,
        actualDistance: 182,
        fuelConsumed: 22,
        status: "COMPLETED",
        vehicleId: vehicleList[3].id,
        driverId: driverList[3].id,
      },
      {
        source: "Katni",
        destination: "Indore",
        cargoWeight: 3900,
        plannedDistance: 600,
        status: "DISPATCHED",
        vehicleId: vehicleList[4].id,
        driverId: driverList[4].id,
      },
    ],
  });

  console.log("✅ Trips created");
    // -----------------------------
  // Fuel Logs
  // -----------------------------
  await prisma.fuelLog.deleteMany();

  await prisma.fuelLog.createMany({
    data: [
      {
        vehicleId: vehicleList[0].id,
        liters: 120,
        cost: 11800,
        date: new Date(),
      },
      {
        vehicleId: vehicleList[1].id,
        liters: 95,
        cost: 9400,
        date: new Date(),
      },
      {
        vehicleId: vehicleList[2].id,
        liters: 80,
        cost: 7900,
        date: new Date(),
      },
    ],
  });

  console.log("✅ Fuel logs created");

  // -----------------------------
  // Maintenance Logs
  // -----------------------------
  await prisma.maintenanceLog.deleteMany();

  await prisma.maintenanceLog.createMany({
    data: [
      {
        vehicleId: vehicleList[3].id,
        type: "Engine Service",
        cost: 25000,
        startDate: new Date("2026-07-01"),
        endDate: new Date("2026-07-03"),
        isActive: false,
      },
      {
        vehicleId: vehicleList[4].id,
        type: "Brake Inspection",
        cost: 8000,
        startDate: new Date(),
        isActive: true,
      },
    ],
  });

  console.log("✅ Maintenance logs created");

  // -----------------------------
  // Expenses
  // -----------------------------
  await prisma.expense.deleteMany();

  await prisma.expense.createMany({
    data: [
      {
        vehicleId: vehicleList[0].id,
        category: "Toll",
        amount: 1800,
        date: new Date(),
      },
      {
        vehicleId: vehicleList[1].id,
        category: "Parking",
        amount: 500,
        date: new Date(),
      },
      {
        vehicleId: vehicleList[2].id,
        category: "Miscellaneous",
        amount: 1200,
        date: new Date(),
      },
    ],
  });

  console.log("✅ Expenses created");

  console.log("🎉 Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });