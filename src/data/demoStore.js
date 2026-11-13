import { products as starterProducts } from "./products";

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
