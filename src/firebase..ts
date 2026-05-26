import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCUcJCiWqAY77Jh5MnnsjPkCizWS4F2av4",
  databaseURL: "https://esp-project-ebe94-default-rtdb.firebaseio.com",
  projectId: "esp-project-ebe94",
};

// Firebase ආරම්භ කිරීම
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);