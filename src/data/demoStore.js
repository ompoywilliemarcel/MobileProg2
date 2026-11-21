import { products as starterProducts } from "./products";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CREATED_ACCOUNTS_KEY = "ustp-wear.created-accounts";
const ADMIN_DATA_KEY = "ustp-wear.admin-data";
const PASSWORD_OVERRIDES_KEY = "ustp-wear.password-overrides";
const PRODUCT_INVENTORY_KEY = "ustp-wear.product-inventory";
let accountsHydrated = false;
let hydrationPromise;
let createdAccounts = [];
let adminData = { disabledEmails: [], deletedEmails: [], activities: [] };
let passwordOverrides = {};
let authenticatedEmail = null;

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
      const savedAdminData = await AsyncStorage.getItem(ADMIN_DATA_KEY);
      const savedPasswordOverrides = await AsyncStorage.getItem(PASSWORD_OVERRIDES_KEY);
      if (savedPasswordOverrides) {
        const parsedOverrides = JSON.parse(savedPasswordOverrides);
        if (parsedOverrides && typeof parsedOverrides === "object") {
          passwordOverrides = parsedOverrides;
        }
      }
      if (savedAdminData) {
        const parsedData = JSON.parse(savedAdminData);
        adminData = {
          disabledEmails: Array.isArray(parsedData.disabledEmails) ? parsedData.disabledEmails : [],
          deletedEmails: Array.isArray(parsedData.deletedEmails) ? parsedData.deletedEmails : [],
          activities: Array.isArray(parsedData.activities) ? parsedData.activities : [],
        };
      }
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
      const deletedEmails = new Set(adminData.deletedEmails.map((email) => email.toLowerCase()));
      for (let index = demoAccounts.length - 1; index >= 0; index -= 1) {
        if (deletedEmails.has(demoAccounts[index].email.toLowerCase())) demoAccounts.splice(index, 1);
      }
      for (const account of demoAccounts) {
        const override = passwordOverrides[account.email.toLowerCase()];
        if (typeof override === "string") account.password = override;
      }
      await loadProductInventory();
      accountsHydrated = true;
    })().catch((error) => {
      hydrationPromise = undefined;
      throw error;
    });
  }
  await hydrationPromise;
};

export const saveCreatedAccount = async (account) => {
  if (account?.role !== "customer" || account?.audience !== "student") {
    throw new Error("Only student accounts can be created through registration.");
  }
  await loadSavedAccounts();
  account.joined = new Date().toLocaleDateString("en-PH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const updatedAccounts = [...createdAccounts, account];
  await AsyncStorage.setItem(
    CREATED_ACCOUNTS_KEY,
    JSON.stringify(updatedAccounts),
  );
  createdAccounts = updatedAccounts;
  demoAccounts.push(account);
  await recordActivity("User Registration", account.name, `Registered a ${account.role} account.`);
};

const saveAdminData = () => AsyncStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(adminData));

const appendActivity = (type, user, description) => {
  adminData.activities.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    user: user || "Unknown user",
    description,
    timestamp: new Date().toISOString(),
  });
  adminData.activities = adminData.activities.slice(0, 500);
};

export const recordActivity = async (type, user, description) => {
  await loadSavedAccounts();
  appendActivity(type, user, description);
  await saveAdminData();
};

export const getActivityLogs = async () => {
  await loadSavedAccounts();
  await requireAdminSession();
  return [...adminData.activities];
};

export const getRegisteredAccounts = async () => {
  await loadSavedAccounts();
  await requireAdminSession();
  return demoAccounts
    .filter((account) => account.role !== "admin")
    .map((account) => ({
      name: account.name || account.email,
      email: account.email,
      id: account.id,
      role: account.role,
      joined: account.joined || "—",
      disabled: adminData.disabledEmails.includes(account.email.toLowerCase()),
    }));
};

export const isAccountDisabled = async (email) => {
  await loadSavedAccounts();
  return adminData.disabledEmails.includes(String(email).toLowerCase());
};

export const resetAccountPassword = async ({ email, id, password, audience }) => {
  await loadSavedAccounts();
  const normalizedEmail = String(email).trim().toLowerCase();
  const account = demoAccounts.find(
    (item) => item.email.toLowerCase() === normalizedEmail,
  );
  const audienceMatches =
    account &&
    (account.audience === audience ||
      (audience === "store" && account.role === "admin"));
  if (!account || !audienceMatches || account.id !== String(id).trim()) {
    throw new Error("We couldn't find an account with those details.");
  }
  if (adminData.deletedEmails.includes(normalizedEmail)) {
    throw new Error("This account is no longer available.");
  }
  if (typeof password !== "string" || password.length < 8) {
    throw new Error("Your new password must be at least 8 characters.");
  }

  account.password = password;
  passwordOverrides[normalizedEmail] = password;
  if (account.role === "customer" && account.audience === "student") {
    createdAccounts = createdAccounts.map((savedAccount) =>
      savedAccount.email.toLowerCase() === normalizedEmail
        ? { ...savedAccount, password }
        : savedAccount,
    );
  }
  appendActivity("Password Reset", account.name, "Reset the account password.");
  await AsyncStorage.multiSet([
    [CREATED_ACCOUNTS_KEY, JSON.stringify(createdAccounts)],
    [PASSWORD_OVERRIDES_KEY, JSON.stringify(passwordOverrides)],
    [ADMIN_DATA_KEY, JSON.stringify(adminData)],
  ]);
};

export const setAuthenticatedAccount = async (email) => {
  await loadSavedAccounts();
  const account = demoAccounts.find((item) => item.email.toLowerCase() === String(email).toLowerCase());
  if (!account || adminData.disabledEmails.includes(account.email.toLowerCase())) {
    throw new Error("Account is unavailable.");
  }
  authenticatedEmail = account.email.toLowerCase();
};

export const clearAuthenticatedAccount = () => {
  authenticatedEmail = null;
};

const requireAdminSession = async () => {
  const account = demoAccounts.find((item) => item.email.toLowerCase() === authenticatedEmail);
  if (!account || account.role !== "admin" || adminData.disabledEmails.includes(account.email.toLowerCase())) {
    throw new Error("Admin access required.");
  }
};

export const isEmailDeleted = async (email) => {
  await loadSavedAccounts();
  return adminData.deletedEmails.includes(String(email).toLowerCase());
};

export const manageRegisteredAccount = async (email, action) => {
  await loadSavedAccounts();
  await requireAdminSession();
  const normalizedEmail = String(email).toLowerCase();
  const account = demoAccounts.find((item) => item.email.toLowerCase() === normalizedEmail);
  if (!account || account.role === "admin") throw new Error("This account cannot be managed.");

  if (action === "disable" || action === "enable") {
    const disabledEmails = new Set(adminData.disabledEmails);
    if (action === "disable") disabledEmails.add(normalizedEmail);
    else disabledEmails.delete(normalizedEmail);
    adminData.disabledEmails = [...disabledEmails];
    appendActivity("Account Management", account.name, `Admin ${action}d the account ${account.email}.`);
    await saveAdminData();
    return;
  }

  if (action !== "delete") throw new Error("Unknown account action.");
  adminData.disabledEmails = adminData.disabledEmails.filter((item) => item !== normalizedEmail);
  adminData.deletedEmails = [...new Set([...adminData.deletedEmails, normalizedEmail])];
  appendActivity("Account Management", account.name, `Admin permanently deleted ${account.email}.`);
  createdAccounts = createdAccounts.filter((item) => item.email.toLowerCase() !== normalizedEmail);
  for (let index = demoAccounts.length - 1; index >= 0; index -= 1) {
    if (demoAccounts[index].email.toLowerCase() === normalizedEmail) demoAccounts.splice(index, 1);
  }
  await AsyncStorage.multiSet([
    [ADMIN_DATA_KEY, JSON.stringify(adminData)],
    [CREATED_ACCOUNTS_KEY, JSON.stringify(createdAccounts)],
  ]);
};

export const store = {
  isOnline: true,
  currentStudentId: null,
  products: starterProducts.map((product) => ({
    ...product,
    hasSizes: product.hasSizes ?? (!/accessor/i.test(product.category || '') && !/lanyard/i.test(product.name)),
    stock: product.stock || (/accessor/i.test(product.category || '') || /lanyard/i.test(product.name)
      ? { quantity: 500 }
      : { S: 100, M: 200, L: 100, XL: 100 }),
  })),
  cart: [],
  cartNotificationCount: 0,
  checkoutItems: [],
  checkoutPickup: '',
  checkoutPickupTime: '10 AM',
  checkoutDirect: false,
  checkoutMethod: 'GCash',
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

export const saveProductInventory = async () => {
  await AsyncStorage.setItem(
    PRODUCT_INVENTORY_KEY,
    JSON.stringify(
      store.products.map((product) => ({ id: product.id, stock: product.stock })),
    ),
  );
};

export const loadProductInventory = async () => {
  const savedInventory = await AsyncStorage.getItem(PRODUCT_INVENTORY_KEY);
  if (!savedInventory) return;
  const parsedInventory = JSON.parse(savedInventory);
  if (!Array.isArray(parsedInventory)) return;
  for (const savedProduct of parsedInventory) {
    const product = store.products.find(
      (item) => String(item.id) === String(savedProduct?.id),
    );
    if (product && savedProduct.stock && typeof savedProduct.stock === "object") {
      product.stock = savedProduct.stock;
    }
  }
};

export const money = (amount) => `\u20B1${Number(amount).toLocaleString("en-PH")}`;
export const productAmount = (product) =>
  Number(String(product.price).replace(/[^0-9.]/g, "")) || 0;

export const getProductStock = (product, size) => {
  const inventory = store.products.find((item) => item.id === product?.id) || product;
  if (!inventory?.stock) return 0;
  return inventory.stock.quantity ?? inventory.stock[size] ?? 0;
};

export const getStockStatus = (quantity) => {
  const count = Number(quantity) || 0;
  if (count <= 0) return "out";
  if (count <= 10) return "low";
  return "high";
};

export const getStockStatusLabel = (quantity) => {
  const status = getStockStatus(quantity);
  return status === "out" ? "Out of stock" : status === "low" ? "Low stock" : "High stock";
};

export const deductOrderStock = (items) => {
  const totals = new Map();
  for (const item of items) {
    const product = store.products.find((entry) => entry.id === item.id);
    const key = product?.stock?.quantity !== undefined ? 'quantity' : item.size;
    const deductionKey = `${item.id}:${key}`;
    const current = totals.get(deductionKey);
    const quantity = item.quantity || 1;
    if (current) {
      current.quantity += quantity;
      continue;
    }
    const available = product?.stock?.[key] ?? 0;
    if (!product || !key || available < quantity) {
      const sizeLabel = item.size ? ` size ${item.size}` : '';
      throw new Error(`${item.name}${sizeLabel} has only ${available} in stock.`);
    }
    totals.set(deductionKey, { product, key, quantity, available, item });
  }
  for (const { item, quantity, available } of totals.values()) {
    if (available < quantity) {
      const sizeLabel = item.size ? ` size ${item.size}` : '';
      throw new Error(`${item.name}${sizeLabel} has only ${available} in stock.`);
    }
  }
  totals.forEach(({ product, key, quantity }) => {
    product.stock[key] -= quantity;
  });
};
