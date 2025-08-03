import { faker } from "@faker-js/faker/locale/en";

export type Deal = {
  id: string;
  title: string;
  image: string;
  price: number;
  lastDate: string;
  type: string;        // ← widen
  month: string;
  region: string;
};

const regions = ["Africa", "Moyen-Orient", "Europe", "Canada"];
const months = ["June", "July", "August"];
const cities = ["Geneva", "Nice", "Munich", "Lyon", "Marseille", "Paris", "Frankfurt"];

export function generateDeals(count = 30): Deal[] {
  return Array.from({ length: count }, (_, i) => {
    const from = "DJERBA(DJE)";
    const to = faker.helpers.arrayElement(cities).toUpperCase();
    return {
      id: `deal-${i}`,
      title: `${from} → ${to}`,
      image: faker.image.urlLoremFlickr({ category: "city" }),
      price: faker.number.int({ min: 450_000, max: 750_000 }),
      lastDate: faker.date.future({ years: 0.3 }).toLocaleDateString("fr-TN"),
      type: faker.helpers.arrayElement(["Round-Trip", "One-Way"]),
      month: faker.helpers.arrayElement(months),
      region: faker.helpers.arrayElement(regions),
    };
  });
}