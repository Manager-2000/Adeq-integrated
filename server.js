import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adeqtesting@gmail.com", // your Gmail
    pass: "ryvk gcbz xnsz sznq", // your Gmail App Password
  },
});

app.post("/send-email", async (req, res) => {
  console.log("📧 Received email request:", req.body);

  const {
    reference,
    name,
    email,
    phone,
    service,
    amount,
    quantity,
    paymentType,
    location,
    date,
    details,
    orderDetails, // Array of items for equipment purchase
  } = req.body;

  if (!email || !service) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required data" });
  }

  // Check if this is an equipment purchase
  const isEquipmentPurchase =
    service === "Equipment Purchase" && Array.isArray(orderDetails);

  // 1. EMAIL TO CUSTOMER
  let customerHtml = "";

  if (isEquipmentPurchase) {
    // Equipment purchase email template
    customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
        <h2 style="color:#0e7490; text-align:center;">ADEQ Water Solutions</h2>
        
        <div style="background:#f0f9ff; padding:20px; border-radius:8px; margin:20px 0;">
          <h3 style="color:#0e7490; margin-top:0;">Order Confirmed! ✅</h3>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for your equipment purchase! Your order has been confirmed.</p>
        </div>

        <h3 style="color:#0e7490;">Order Details:</h3>
        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Reference Number:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">${reference}</td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Order Type:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">Equipment Purchase</td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Items:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">
              <ul>
                ${(Array.isArray(orderDetails) ? orderDetails : [])
                  .map(
                    (item) => `
                    <li>${item.product} - Quantity: ${item.quantity} - Price: ₦${item.price.toLocaleString()}</li>
                  `
                  )
                  .join("")}
              </ul>
            </td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Total Amount:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">₦${amount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Phone:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">${phone}</td>
          </tr>
        </table>

        <div style="background:#f0f9ff; padding:15px; border-radius:8px; margin:20px 0;">
          <h4 style="color:#0e7490; margin-top:0;">Next Steps:</h4>
          <p>Your equipment will be prepared for shipping. We will contact you within <strong>24 hours</strong> with shipping details.</p>
          <p>If you have any questions, please contact us at <strong>${phone}</strong>.</p>
        </div>

        <div style="text-align:center; margin-top:30px; padding-top:20px; border-top:1px solid #eee;">
          <p style="color:#666; font-size:14px;">Thank you for choosing ADEQ Water Solutions</p>
          <p style="color:#999; font-size:12px;">Ilorin, Kwara State, Nigeria</p>
        </div>
      </div>
    `;
  } else {
    // Survey booking email template
    const unitPrice = amount / (quantity || 1);
    const totalAmount = amount;

    customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
        <h2 style="color:#0e7490; text-align:center;">ADEQ Water Solutions</h2>
        
        <div style="background:#f0f9ff; padding:20px; border-radius:8px; margin:20px 0;">
          <h3 style="color:#0e7490; margin-top:0;">Booking Confirmed! ✅</h3>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for your ${paymentType === "half" ? "50% deposit" : "full payment"}! Your booking has been confirmed.</p>
        </div>

        <h3 style="color:#0e7490;">Booking Details:</h3>
        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Reference Number:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">${reference}</td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Service:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">${service}</td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Quantity:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">${quantity || 1}</td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Payment Type:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">${paymentType === "half" ? "50% Deposit" : "Full Payment"}</td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Amount ${paymentType === "half" ? "Deposited" : "Paid"}:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">₦${amount.toLocaleString()}</td>
          </tr>
          ${
            paymentType === "half"
              ? `
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Remaining Balance:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">₦${amount.toLocaleString()}</td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Total Amount:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">₦${totalAmount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Phone:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">${phone}</td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Location:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">${location}</td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Preferred Date:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">${date}</td>
          </tr>
          ${
            details
              ? `
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Details:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">${details}</td>
          </tr>
          `
              : ""
          }
        </table>
      </div>
    `;
  }

  // 2. EMAIL TO OWNER
  let ownerHtml = "";

  if (isEquipmentPurchase) {
    // Equipment purchase email template for owner
    ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
        <h2 style="color:#dc2626; text-align:center;">NEW EQUIPMENT ORDER! 🚨</h2>
        
        <div style="background:#fef2f2; padding:20px; border-radius:8px; margin:20px 0;">
          <h3 style="color:#dc2626; margin-top:0;">Equipment Order Details</h3>
          
          <table style="width:100%; border-collapse:collapse; margin:20px 0;">
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Reference:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${reference}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Customer:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Email:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Phone:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${phone}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Order Type:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">Equipment Purchase</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Items:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">
                <ul>
                  ${(Array.isArray(orderDetails) ? orderDetails : [])
                    .map(
                      (item) => `
                      <li>${item.product} - Quantity: ${item.quantity} - Price: ₦${item.price.toLocaleString()}</li>
                    `
                    )
                    .join("")}
                </ul>
              </td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Total Amount:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">₦${amount.toLocaleString()}</td>
            </tr>
          </table>
        </div>
      </div>
    `;
  } else {
    // Survey booking email template for owner
    const unitPrice = amount / (quantity || 1);
    const totalAmount = amount;

    ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
        <h2 style="color:#dc2626; text-align:center;">NEW BOOKING: ${service} - ${reference}</h2>
        
        <div style="background:#fef2f2; padding:20px; border-radius:8px; margin:20px 0;">
          <h3 style="color:#dc2626; margin-top:0;">Customer Booking Details</h3>
          
          <table style="width:100%; border-collapse:collapse; margin:20px 0;">
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Reference:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${reference}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Customer:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Email:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Phone:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${phone}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Service:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${service}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Quantity:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${quantity || 1}</td>
            </tr>
            // <tr>
            //   <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Unit Price:</td>
            //   <td style="padding:10px; border-bottom:1px solid #eee;">₦${unitPrice.toLocaleString()}</td>
            // </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Payment Type:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${paymentType === "half" ? "50% Deposit" : "Full Payment"}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Amount Received:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">₦${amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Total Amount:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">₦${totalAmount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Location:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${location}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Preferred Date:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${date}</td>
            </tr>
            ${
              details
                ? `
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Details:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${details}</td>
            </tr>
            `
                : ""
            }
          </table>
        </div>
      </div>
    `;
  }

  const customerMailOptions = {
    from: "ADEQ Water Solutions <adeqtesting@gmail.com>",
    to: email,
    subject: isEquipmentPurchase
      ? `Order Confirmation - ${reference}`
      : `Booking Confirmation - ${reference}`,
    html: customerHtml,
  };

  const ownerMailOptions = {
    from: "ADEQ Booking System <adeqtesting@gmail.com>",
    to: "adeqtesting@gmail.com", // Replace with owner's email
    subject: isEquipmentPurchase
      ? `🚨 NEW EQUIPMENT ORDER - ${reference}`
      : `🚨 NEW BOOKING: ${service} - ${reference}`,
    html: ownerHtml,
  };

  try {
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(ownerMailOptions),
    ]);

    console.log("✅ Emails sent successfully!");
    res.json({
      success: true,
      message: "Confirmation emails sent successfully",
    });
  } catch (error) {
    console.error("❌ Email Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send confirmation emails" });
  }
});

// Add this endpoint to your server.js file
app.post("/api/send-verification", async (req, res) => {
  const { email, code } = req.body;

  try {
    const mailOptions = {
      from: "ADEQ Water Solutions <adeqtesting@gmail.com>",
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
          <h2 style="color:#0e7490; text-align:center;">ADEQ Water Solutions</h2>
          
          <div style="background:#f0f9ff; padding:20px; border-radius:8px; margin:20px 0;">
            <h3 style="color:#0e7490; margin-top:0;">Email Verification</h3>
            <p>Thank you for registering with ADEQ Water Solutions!</p>
            <p>Your verification code is:</p>
            <div style="text-align:center; margin:20px 0;">
              <div style="display:inline-block; background:#0e7490; color:white; padding:10px 20px; border-radius:5px; font-size:24px; font-weight:bold; letter-spacing:2px;">
                ${code}
              </div>
            </div>
            <p>Enter this code in the verification form to complete your registration.</p>
            <p style="font-size:12px; color:#666; margin-top:20px;">If you didn't request this code, please ignore this email.</p>
          </div>
          
          <div style="text-align:center; margin-top:30px; padding-top:20px; border-top:1px solid #eee;">
            <p style="color:#666; font-size:14px;">ADEQ Water Solutions</p>
            <p style="color:#999; font-size:12px;">Ilorin, Kwara State, Nigeria</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    res.json({ success: true, message: "Verification email sent" });
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send verification email" });
  }
});

// Add this endpoint to your server.js file
app.post("/api/send-password-reset", async (req, res) => {
  const { email, code } = req.body;

  try {
    const mailOptions = {
      from: "ADEQ Water Solutions <adeqtesting@gmail.com>",
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
          <h2 style="color:#0e7490; text-align:center;">ADEQ Water Solutions</h2>
          
          <div style="background:#f0f9ff; padding:20px; border-radius:8px; margin:20px 0;">
            <h3 style="color:#0e7490; margin-top:0;">Password Reset Request</h3>
            <p>We received a request to reset your password for your ADEQ Water Solutions account.</p>
            <p>Your password reset code is:</p>
            <div style="text-align:center; margin:20px 0;">
              <div style="display:inline-block; background:#0e7490; color:white; padding:10px 20px; border-radius:5px; font-size:24px; font-weight:bold; letter-spacing:2px;">
                ${code}
              </div>
            </div>
            <p>Enter this code in the password reset form to create a new password.</p>
            <p style="font-size:12px; color:#666; margin-top:20px;">If you didn't request a password reset, please ignore this email.</p>
          </div>
          
          <div style="text-align:center; margin-top:30px; padding-top:20px; border-top:1px solid #eee;">
            <p style="color:#666; font-size:14px;">ADEQ Water Solutions</p>
            <p style="color:#999; font-size:12px;">Ilorin, Kwara State, Nigeria</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    res.json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send password reset email" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });
