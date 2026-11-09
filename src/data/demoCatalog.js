// Demo data, shown when the app cannot reach the live backend (no MongoDB,
// OpenAI, or Google key needed). Everything here is sample data: the
// judgments are canned examples of what the AI judge returns, NOT safety
// assessments, and the pantries are made-up pins near a fixed demo location.
// The UI labels all of it as demo data; nothing here should be used to
// decide whether food is safe to eat or donate.
//
// Dates are relative to today so the demo never goes stale.

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

// Washington Square Park, New York. Used when the browser has no geolocation
// (denied or unavailable) so the pantry map still has somewhere to center.
const DEMO_CENTER = { lat: 40.7308, lng: -73.9973 };

const demoProducts = [
  {
    _id: "demo-1",
    productName: "Whole Milk",
    category: "Dairy",
    isCanned: false,
    price: 3.49,
    stockQuantity: 12,
    expirationDate: daysAgo(2),
  },
  {
    _id: "demo-2",
    productName: "Whole Wheat Bread",
    category: "Bakery",
    isCanned: false,
    price: 2.99,
    stockQuantity: 8,
    expirationDate: daysAgo(1),
  },
  {
    _id: "demo-3",
    productName: "Chicken Breast",
    category: "Poultry",
    isCanned: false,
    price: 8.99,
    stockQuantity: 5,
    expirationDate: daysAgo(6),
  },
  {
    _id: "demo-4",
    productName: "Canned Tuna",
    category: "Meat",
    isCanned: true,
    price: 1.99,
    stockQuantity: 20,
    expirationDate: daysAgo(30),
  },
  {
    _id: "demo-5",
    productName: "Greek Yogurt",
    category: "Dairy",
    isCanned: false,
    price: 4.49,
    stockQuantity: 6,
    expirationDate: daysAgo(4),
  },
  {
    _id: "demo-6",
    productName: "Baby Spinach",
    category: "Produce",
    isCanned: false,
    price: 2.49,
    stockQuantity: 10,
    expirationDate: daysAgo(3),
  },
  {
    _id: "demo-7",
    productName: "Frozen Peas",
    category: "Frozen Foods",
    isCanned: false,
    price: 1.79,
    stockQuantity: 15,
    expirationDate: daysAgo(10),
  },
  {
    _id: "demo-8",
    productName: "Ibuprofen",
    category: "Medicine",
    isCanned: false,
    price: 6.99,
    stockQuantity: 4,
    expirationDate: daysAgo(45),
  },
];

// Sample judgments in exactly the shape the backend returns
// ({ foodName, isSafe, estimatedSafetyDate, explanation, _id }).
// These are illustrative examples, not assessments of real food.
const demoJudgments = [
  {
    _id: "demo-1",
    foodName: "Whole Milk",
    isSafe: true,
    estimatedSafetyDate: daysFromNow(3),
    explanation:
      "This milk is two days past its printed date, but milk is usually fine for several days past the sell-by date if it was kept refrigerated at or below 40°F the whole time. The date on the carton is about quality, not a hard safety cutoff. Check that it smells and tastes normal and that the carton was never left out. If it passes those checks it can be donated, but it should reach a pantry within three days.",
  },
  {
    _id: "demo-2",
    foodName: "Whole Wheat Bread",
    isSafe: true,
    estimatedSafetyDate: daysFromNow(4),
    explanation:
      "Bread one day past its date is generally safe to donate as long as there is no visible mold. Bread goes stale before it becomes unsafe, and the printed date marks peak freshness rather than safety. Check every slice for mold spots, including the ends of the loaf. If it is mold-free and was stored sealed, it can be donated within the next few days.",
  },
  {
    _id: "demo-3",
    foodName: "Chicken Breast",
    isSafe: false,
    estimatedSafetyDate: daysFromNow(0),
    explanation:
      "Raw chicken six days past its date should not be donated. Poultry is one of the highest-risk foods for bacterial growth, and the safe window after the printed date is only one to two days even under steady refrigeration. Six days is well past that, and there is no reliable way to check safety by smell or appearance. This should be discarded rather than donated.",
  },
  {
    _id: "demo-4",
    foodName: "Canned Tuna",
    isSafe: true,
    estimatedSafetyDate: daysFromNow(90),
    explanation:
      "Canned tuna is shelf-stable for years, and a date one month past is not a safety concern on its own. Canned goods are safe as long as the can is intact, with no swelling, rust, dents on the seams, or leakage. Check the can carefully before donating. If it is undamaged, it can be donated and stored at the pantry for months.",
  },
  {
    _id: "demo-5",
    foodName: "Greek Yogurt",
    isSafe: true,
    estimatedSafetyDate: daysFromNow(5),
    explanation:
      "Yogurt four days past its date is usually still safe if it was kept refrigerated, because its live cultures keep it acidic and slow spoilage. The printed date is a quality date, and yogurt often keeps a week past it. Check for mold, swelling, or a sharp off smell before donating. If it looks and smells normal, it can go to a pantry within five days.",
  },
  {
    _id: "demo-6",
    foodName: "Baby Spinach",
    isSafe: true,
    estimatedSafetyDate: daysFromNow(2),
    explanation:
      "Bagged spinach three days past its date can still be donated if the leaves are green and crisp rather than slimy or dark. Leafy greens wilt and spoil visibly, so a quick look tells you most of what you need to know. Discard any slimy leaves and check that the bag was kept refrigerated. It should be donated within two days, since greens fade fast once opened.",
  },
  {
    _id: "demo-7",
    foodName: "Frozen Peas",
    isSafe: true,
    estimatedSafetyDate: daysFromNow(60),
    explanation:
      "Frozen peas ten days past their date are safe to donate as long as they stayed frozen the whole time. Freezing stops bacterial growth, so the printed date is about taste and texture, not safety. Check that the bag is still solid and free of freezer burn or signs of thawing and refreezing. If it stayed frozen, it can be donated and kept frozen at the pantry for months.",
  },
  {
    _id: "demo-8",
    foodName: "Ibuprofen",
    isSafe: false,
    estimatedSafetyDate: daysFromNow(0),
    explanation:
      "Expired medicine should never be donated, even if it looks unchanged. Drugs lose potency past their date, and there is no safe way for a pantry to verify what is still effective. Food pantries do not accept medication, expired or not. Take it to a drug take-back program or pharmacy disposal instead.",
  },
];

// Sample pantry pins near the demo center. Names carry no hyphens because
// the list shortens names on "-". The closed one exercises the list filter:
// only OPERATIONAL pantries are shown.
const demoPantries = [
  {
    place_id: "demo-pantry-1",
    name: "Sample Pantry Washington Square",
    business_status: "OPERATIONAL",
    geometry: { location: { lat: 40.7315, lng: -73.997 } },
    vicinity: "Demo location, New York, NY",
  },
  {
    place_id: "demo-pantry-2",
    name: "Sample Pantry West 4th Street",
    business_status: "OPERATIONAL",
    geometry: { location: { lat: 40.7322, lng: -73.9995 } },
    vicinity: "Demo location, New York, NY",
  },
  {
    place_id: "demo-pantry-3",
    name: "Sample Pantry Thompson Street",
    business_status: "CLOSED_TEMPORARILY",
    geometry: { location: { lat: 40.729, lng: -73.995 } },
    vicinity: "Demo location, New York, NY",
  },
];

const DEMO_FLAG = "demoMode";

const markDemoMode = () => {
  try {
    sessionStorage.setItem(DEMO_FLAG, "1");
  } catch {
    // sessionStorage unavailable; the demo data still works, only the
    // banner won't show.
  }
};

const clearDemoMode = () => {
  try {
    sessionStorage.removeItem(DEMO_FLAG);
  } catch {
    // ignore
  }
};

const isDemoMode = () => {
  try {
    return sessionStorage.getItem(DEMO_FLAG) === "1";
  } catch {
    return false;
  }
};

// Sample judgments for the selected products, in backend response shape.
const demoJudgmentsFor = (products) =>
  products
    .map((p) => demoJudgments.find((j) => j._id === p._id))
    .filter(Boolean);

export {
  DEMO_CENTER,
  demoProducts,
  demoJudgments,
  demoPantries,
  markDemoMode,
  clearDemoMode,
  isDemoMode,
  demoJudgmentsFor,
};
