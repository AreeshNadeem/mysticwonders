const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const axios = require("axios");

// Function to notify n8n on new order
exports.notifyOnNewOrder = onDocumentCreated("orders/{orderId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return null;

    const orderData = snapshot.data();
    const orderId = event.params.orderId;

    // n8n Webhook URL for orders
    const n8nOrderWebhookUrl = "https://areeshnm28.app.n8n.cloud/webhook/mystic-order";

    try {
        console.log(`Forwarding order ${orderId} to n8n...`);
        await axios.post(n8nOrderWebhookUrl, {
            orderId,
            ...orderData
        });
        console.log("Successfully forwarded order to n8n.");
    } catch (error) {
        console.error("Error sending order to n8n:", error.message);
    }
    return null;
});

// Function to notify n8n on new newsletter subscription
exports.sendToN8nOnSubscribe = onDocumentCreated("newsletter/{docId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return null;

    const newValue = snapshot.data();
    const emailAddress = newValue.email;
    const nameField = newValue.name || "friend";

    const n8nWebhookUrl = "https://areeshnm28.app.n8n.cloud/webhook/mystic-subscriber";

    try {
        await axios.post(n8nWebhookUrl, {
            email: emailAddress,
            name: nameField
        });
    } catch (error) {
        console.error("Error sending subscriber to n8n:", error.message);
    }
    return null;
});