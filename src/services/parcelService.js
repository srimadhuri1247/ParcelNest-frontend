import {
  initialParcels,
  initialNotifications,
} from "../data/demoData";

const PARCELS_KEY = "campus_parcels";
const NOTIFICATIONS_KEY = "campus_notifications";

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getParcels() {
  return readStorage(PARCELS_KEY, initialParcels);
}

export function getParcelById(id) {
  return getParcels().find(
    (parcel) =>
      parcel.id === id || parcel.trackingNumber === id
  );
}

export function addParcel(form, managerName) {
  const parcels = getParcels();

  const recipientId = form.recipientId.trim().toUpperCase();
  const trackingNumber = `CAMPUS-${Date.now()}`;

  const parcel = {
    id: `CP${Date.now()}`,
    trackingNumber,
    recipientId,
    recipientName: form.recipientName.trim(),
    recipientEmail: form.recipientEmail.trim().toLowerCase(),
    courierName: form.courierName.trim(),
    courierTrackingNumber: form.courierTrackingNumber.trim(),
    receivedAt: new Date().toISOString(),
    status: "RECEIVED",
    storageLocation: form.storageLocation.trim(),
    createdBy: managerName,
    collectedAt: null,
  };

  saveStorage(PARCELS_KEY, [parcel, ...parcels]);

  addNotification(
    parcel.recipientEmail,
    parcel.id,
    `Your parcel has been received. Tracking number: ${trackingNumber}`
  );

  return parcel;
}

export function updateParcelStatus(id, status) {
  const parcels = getParcels();
  const parcel = parcels.find((item) => item.id === id);

  if (!parcel) throw new Error("Parcel not found.");

  const allowedTransitions = {
    RECEIVED: ["PROCESSING"],
    PROCESSING: ["READY_FOR_PICKUP"],
    READY_FOR_PICKUP: ["COLLECTED"],
    COLLECTED: [],
  };

  if (!allowedTransitions[parcel.status]?.includes(status)) {
    throw new Error(
      `Cannot change status from ${parcel.status} to ${status}.`
    );
  }

  const updated = parcels.map((item) =>
    item.id === id
      ? {
          ...item,
          status,
          collectedAt:
            status === "COLLECTED"
              ? new Date().toISOString()
              : item.collectedAt,
        }
      : item
  );

  saveStorage(PARCELS_KEY, updated);

  const message =
    status === "PROCESSING"
      ? "Your parcel is being processed."
      : status === "READY_FOR_PICKUP"
      ? "Your parcel is ready for pickup."
      : "Your parcel collection has been confirmed.";

  addNotification(parcel.recipientEmail, parcel.id, message);

  return updated.find((item) => item.id === id);
}

export function confirmCollection(id) {
  return updateParcelStatus(id, "COLLECTED");
}

export function getNotifications(email) {
  return readStorage(NOTIFICATIONS_KEY, initialNotifications)
    .filter(
      (notification) =>
        notification.userEmail.toLowerCase() === email.toLowerCase()
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}

export function addNotification(email, parcelId, message) {
  const notifications = readStorage(
    NOTIFICATIONS_KEY,
    initialNotifications
  );

  saveStorage(NOTIFICATIONS_KEY, [
    {
      id: Date.now(),
      userEmail: email,
      parcelId,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    },
    ...notifications,
  ]);
}

export function markNotificationRead(id) {
  const notifications = readStorage(
    NOTIFICATIONS_KEY,
    initialNotifications
  );

  saveStorage(
    NOTIFICATIONS_KEY,
    notifications.map((item) =>
      item.id === id ? { ...item, read: true } : item
    )
  );
}