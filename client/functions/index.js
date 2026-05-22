const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const axios = require("axios");

// This function triggers automatically whenever a document is created in the 'newsletter' collection
exports.sendToN8nOnSubscribe = onDocumentCreated("newsletter/{docId}", async (event) => {
    // 1. Grab the freshly submitted data from the Firestore document event
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No snapshot data found");
        return null;
    }

    const newValue = snapshot.data();
    const emailAddress = newValue.email;
    const nameField = newValue.name || "Mystic Friend";

    // 2. Your n8n Webhook Test URL (Swap to Production URL later when going live)
    const n8nWebhookUrl = "https://areeshnm28.app.n8n.cloud/webhook/mystic-subscriber";

    try {
        // 3. Post the data directly to n8n
        console.log(`Forwarding subscriber ${emailAddress} to n8n...`);
        await axios.post(n8nWebhookUrl, {
            email: emailAddress,
            name: nameField
        });
        console.log("Successfully forwarded to n8n.");
    } catch (error) {
        console.error("Error sending data to n8n webhook:", error.message);
    }
    return null;
});