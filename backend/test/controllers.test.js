// Backend controller tests. No MongoDB, OpenAI, or Google key needed: the
// network modules are stubbed in require.cache before the controllers load,
// so these tests exercise the real controller code against fake responses.
//
// Run: npm test (from backend/) or node --test test/ (from the repo root).
const test = require("node:test");
const assert = require("node:assert/strict");

// --- Stub node-fetch (used by mapController) -------------------------------
const fetchPath = require.resolve("node-fetch");
let capturedUrl = null;
require.cache[fetchPath] = {
  id: fetchPath,
  filename: fetchPath,
  loaded: true,
  exports: async (url) => {
    capturedUrl = url;
    return { ok: true, json: async () => ({ results: [] }) };
  },
};

// --- Stub openai (used by checkProductExpiration) -------------------------
const openaiPath = require.resolve("openai");
let fakeItems = [];
let fakeParseError = null;
class FakeOpenAI {
  constructor() {
    this.beta = {
      chat: {
        completions: {
          parse: async () => {
            if (fakeParseError) throw fakeParseError;
            return {
              choices: [
                {
                  message: {
                    content: JSON.stringify({ items: fakeItems }),
                  },
                },
              ],
            };
          },
        },
      },
    };
  }
}
require.cache[openaiPath] = {
  id: openaiPath,
  filename: openaiPath,
  loaded: true,
  exports: FakeOpenAI,
};

const { getLocations } = require("../controllers/mapController.js");
const { checkProduct } = require("../controllers/productController.js");

function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test("mapController builds a valid Places URL (no line breaks)", async () => {
  const req = { query: { query: "food pantry", lat: "40.7308", lng: "-73.9973" } };
  const res = mockRes();
  await getLocations(req, res);

  assert.equal(res.statusCode, null); // success: res.json without status()
  assert.deepEqual(res.body, { results: [] });

  // The old code built this URL from a multi-line template literal, so it
  // contained literal newlines and could never be fetched.
  assert.ok(capturedUrl, "expected a fetch to happen");
  assert.equal(/\s/.test(capturedUrl), false, `URL has whitespace: ${capturedUrl}`);
  const url = new URL(capturedUrl);
  assert.equal(url.hostname, "maps.googleapis.com");
  assert.equal(url.pathname, "/maps/api/place/nearbysearch/json");
  assert.equal(url.searchParams.get("location"), "40.7308,-73.9973");
  assert.equal(url.searchParams.get("keyword"), "food pantry");
  assert.equal(url.searchParams.get("rankby"), "distance");
  assert.ok(url.searchParams.has("key"));
});

test("mapController rejects a request missing lat/lng/query", async () => {
  const res = mockRes();
  await getLocations({ query: { query: "food pantry" } }, res);
  assert.equal(res.statusCode, 400);
});

test("checkProduct attaches each judgment's _id from the matching product", async () => {
  fakeParseError = null;
  fakeItems = [
    { foodName: "Milk", isSafe: true, estimatedSafetyDate: "2026-11-20", explanation: "x" },
    { foodName: "Mystery Item", isSafe: false, estimatedSafetyDate: "2026-11-09", explanation: "y" },
  ];
  const req = {
    body: [
      { _id: "507f1f77bcf86cd799439011", productName: "Milk", expirationDate: "2026-11-10" },
      { _id: "507f1f77bcf86cd799439012", productName: "Bread", expirationDate: "2026-11-08" },
    ],
  };
  const res = mockRes();
  await checkProduct(req, res);

  assert.equal(res.statusCode, 200);
  const [milk, mystery] = res.body.expirationInfo;
  assert.equal(milk.foodName, "Milk");
  // The frontend keys rows on checkedItem._id; the old code set `id`
  // instead, so every row keyed as "undefined827498".
  assert.equal(milk._id, "507f1f77bcf86cd799439011");
  // A judgment with no matching product must not throw on match._id.
  assert.equal(mystery.foodName, "Mystery Item");
  assert.equal(mystery._id, undefined);
});

test("checkProduct rejects an empty selection", async () => {
  const res = mockRes();
  await checkProduct({ body: [] }, res);
  assert.equal(res.statusCode, 400);
});

test("checkProduct returns 500 JSON (not a crash) when the judge fails", async () => {
  fakeParseError = new Error("model unavailable");
  const res = mockRes();
  await checkProduct(
    { body: [{ _id: "507f1f77bcf86cd799439011", productName: "Milk", expirationDate: "2026-11-10" }] },
    res
  );
  assert.equal(res.statusCode, 500);
  assert.match(res.body.message, /Error/);
  fakeParseError = null;
});
