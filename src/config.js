// Base URL of the backend API. Override with VITE_API_URL in .env when the
// backend runs somewhere other than localhost:3000.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default API_BASE;
