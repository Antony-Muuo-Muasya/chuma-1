
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json());

// --- CONFIGURATION ---
// Credentials from prompt
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "Ae7qJ8qRVcs7Sc2jE_sRPWuCbjL-68HqmL1KkRY1Lt_kRQotx-RyRvt_Nhwedc2RGHzCXkUBYRjefWYT";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "EKBInl5eIYmtARF2h1cHyAVBfntIJSCsNdGSk0lkMMm8gDZhVo0tC0VvP99iRzLPKOqervR9-j8ZZyW8";

// Use sandbox for dev, live for production
const PAYPAL_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 */
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw error;
  }
};

/**
 * Create an order to start the transaction.
 */
app.post("/api/orders", async (req, res) => {
  try {
    const { cart, amount, currency } = req.body;
    
    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_BASE_URL}/v2/checkout/orders`;
    
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency || "USD",
            value: amount, // Ensure this is a string
          },
          description: "CHUMA Merch Order",
        },
      ],
      payment_source: {
        paypal: {
            experience_context: {
                brand_name: "CHUMA",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                shipping_preference: "NO_SHIPPING"
            }
        }
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (response.status !== 200 && response.status !== 201) {
        console.error("PayPal Order Error:", data);
        return res.status(response.status).json(data); // Forward actual PayPal error
    }
    
    res.json(data);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order.", details: error.message });
  }
});

/**
 * Capture payment for the created order to complete the transaction.
 */
app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    
    if (response.status !== 200 && response.status !== 201) {
        console.error("PayPal Capture Error:", data);
        return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order.", details: error.message });
  }
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
