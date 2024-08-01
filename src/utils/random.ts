import { v4 as uuidv4 } from "uuid";

export function getRandomId(): number {
  // Generate a UUID
  const uuid = uuidv4();

  // Extract the first 8 characters of the UUID and convert it to a number
  const uuidPart = parseInt(uuid.split("-")[0], 16);

  // Combine with current timestamp to ensure more uniqueness
  const id = Date.now() + uuidPart;

  return id;
}
