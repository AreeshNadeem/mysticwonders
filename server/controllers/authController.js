const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const twilio = require('twilio');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });

// Lazy-init Twilio client (skips init if env vars are missing)
const getTwilioClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID.startsWith('your_')) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// POST /api/auth/request-otp
exports.requestOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    // Upsert user
    let user = await User.findOne({ phone });
    if (!user) user = await User.create({ phone });

    const code = generateOtp();
    user.otp = { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }; // 10 min
    await user.save();

    // Send via Twilio WhatsApp — gracefully skip if not configured
    const client = getTwilioClient();
    if (client) {
      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to:   `whatsapp:${phone}`,
        body: `Your Mystic Wonders verification code is: ${code}. Valid for 10 minutes ✦`,
      });
    } else {
      // Dev fallback: log OTP to console
      console.log(`[DEV] OTP for ${phone}: ${code}`);
    }

    res.json({ message: 'OTP sent', dev_otp: process.env.NODE_ENV !== 'production' ? code : undefined });
  } catch (err) { next(err); }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ message: 'Phone and code are required' });

    const user = await User.findOne({ phone });
    if (!user || !user.otp?.code) return res.status(400).json({ message: 'No OTP found — please request a new one' });
    if (user.otp.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });
    if (user.otp.code !== code) return res.status(400).json({ message: 'Invalid OTP' });

    // Clear OTP
    user.otp = undefined;
    await user.save();

    res.json({ token: signToken(user._id), user });
  } catch (err) { next(err); }
};
