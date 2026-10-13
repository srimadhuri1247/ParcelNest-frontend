
export const demoUsers = [
  {
    id: 1,
    name: "Student Demo",
    email: "student@parcelnest.com",
    password: "student123",
    role: "USER",
  },
  {
    id: 2,
    name: "Parcel Manager",
    email: "manager@parcelnest.com",
    password: "manager123",
    role: "MANAGER",
  },
  {
    id: 3,
    name: "System Admin",
    email: "admin@parcelnest.com",
    password: "admin123",
    role: "ADMIN",
  },
];

export const initialParcels = [
  {
    id: "PN1001",
    recipientName: "Student Demo",
    recipientEmail: "student@parcelnest.com",
    courierName: "Blue Dart",
    trackingNumber: "BD123456",
    storageLocation: "Parcel Room A",
    status: "RECEIVED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "PN1002",
    recipientName: "Student Demo",
    recipientEmail: "student@parcelnest.com",
    courierName: "India Post",
    trackingNumber: "IP654321",
    storageLocation: "Parcel Room B",
    status: "READY_FOR_PICKUP",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const initialNotifications = [];
