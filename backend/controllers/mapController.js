require("dotenv").config();
const fetch = require("node-fetch");

const getLocations = async (req, res) => {
  const { query, lat, lng } = req.query;
  const API_KEY = process.env.VITE_GOOGLE_API_KEY; // Make sure the correct env var is used
  if (!query || !lat || !lng) {
    return res.status(400).json({ message: "Missing essential data" });
  }

  const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json
?location=${lat},${lng}
&keyword=${encodeURIComponent(query)}
&rankby=distance
&key=${encodeURIComponent(API_KEY)}`;

  try {
    const response = await fetch(URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return res
        .status(500)
        .json({ message: "There was an error fetching your data" });
    }

    const data = await response.json();
    return res.json(data); // Send the fetched data back to the client
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error: " + error.message });
  }
};

module.exports = { getLocations };
