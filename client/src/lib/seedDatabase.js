import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { PRODUCTS } from './constants';

export const seedDatabase = async () => {
  try {
    for (const product of PRODUCTS) {
      const docRef = doc(collection(db, 'products'), product.id.toString());
      await setDoc(docRef, { ...product });
    }
    console.log("Database seeded successfully!");
    alert("Database seeded successfully with all products! ✦");
  } catch (error) {
    console.error("Error seeding database:", error);
    alert("There was an error seeding the database. Check console.");
  }
};
