// Import necessary modules from Firebase functions
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors");

// Initialize CORS
const corsHandler = cors({ origin: true }); // Change to specific origin if needed

// Create a CORS-enabled function
exports.corsFunction = onRequest((request, response) => {
  // Use CORS to handle preflight and main requests
  corsHandler(request, response, () => {
    logger.info("Received request", { structuredData: true });

    // Process your request here
    if (request.method === "OPTIONS") {
      // Handle preflight request
      response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      response.set("Access-Control-Allow-Headers", "Content-Type");
      response.status(204).send(""); // No content response
    } else {
      // Handle your main request here
      response.send("CORS is enabled for this endpoint!");
    }
  });
});

// You can add more functions below this line
