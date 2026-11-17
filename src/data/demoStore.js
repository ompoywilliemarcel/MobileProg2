import { products as starterProducts } from "./products";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CREATED_ACCOUNTS_KEY = "ustp-wear.created-accounts";
let accountsHydrated = false;
let hydrationPromise;
let createdAccounts = [];

export const demoAccounts = [
  {
    email: "user123",
    password: "user_123",
    role: "user",
    audience: "store",
    id: "3212345",
    name: "USTP Store",
  },
  {
    email: "student123",
    password: "student_123",
    role: "customer",
    audience: "student",
    id: "2021234567",
    name: "Daniel Cezar",
  },
  {
    email: "admin123",
    password: "admin_123",
    role: "admin",
    audience: "store",
    id: "3298765",
    name: "Admins",
  },
];

export const loadSavedAccounts = async () => {
  if (accountsHydrated) return;
  if (!hydrationPromise) {
    hydrationPromise = (async () => {
      const savedAccounts = await AsyncStorage.getItem(CREATED_ACCOUNTS_KEY);
      if (savedAccounts) {
        const parsedAccounts = JSON.parse(savedAccounts);
        if (Array.isArray(parsedAccounts)) {
          const existingEmails = new Set(demoAccounts.map((account) => account.email.toLowerCase()));
          createdAccounts = parsedAccounts.filter((account) => {
            const email = account?.email?.toLowerCase();
            if (!email || existingEmails.has(email)) return false;
            existingEmails.add(email);
            return true;
          });
          demoAccounts.push(...createdAccounts);
        }
      }
      accountsHydrated = true;
    })().catch((error) => {
      hydrationPromise = undefined;
      throw error;
    });
  }
  await hydrationPromise;
};

export const saveCreatedAccount = async (account) => {
  await loadSavedAccounts();
  const updatedAccounts = [...createdAccounts, account];
  await AsyncStorage.setItem(
    CREATED_ACCOUNTS_KEY,
    JSON.stringify(updatedAccounts),
  );
  createdAccounts = updatedAccounts;
  demoAccounts.push(account);
};

export const store = {
  products: [...starterProducts],
  cart: [],
  cartNotificationCount: 0,
  users: [
    {
      name: "Alex Student",
      email: "student123",
      role: "customer",
      joined: "Nov 10, 2026",
    },
    {
      name: "Store Manager",
      email: "user123",
      role: "user",
      joined: "Nov 10, 2026",
    },
    {
      name: "USTP Admin",
      email: "admin123",
      role: "admin",
      joined: "Nov 10, 2026",
    },
  ],
  orders: [
    {
      id: "USTP-1042",
      customer: "Alex Student",
      item: "Trailblazer Shirt",
      total: 500,
      status: "Ready for pickup",
      method: "GCash",
      date: "Nov 10",
    },
    {
      id: "USTP-1041",
      customer: "Jamie Cruz",
      item: "Lanyard",
      total: 100,
      status: "Preparing",
      method: "Cash",
      date: "Nov 09",
    },
  ],
  reservations: [],
};

export const money = (amount) => `\u20B1${Number(amount).toLocaleString("en-PH")}`;
export const productAmount = (product) =>
  Number(String(product.price).replace(/[^0-9.]/g, "")) || 0;
