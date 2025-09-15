const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ CORRECTED: createTransport (not createTransporter)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adeqtesting@gmail.com",
    pass: "ryvk gcbz xnsz sznq",
  },
});

// Test endpoint to check if server is working
app.get("/test", (req, res) => {
  res.json({ message: "Server is working! ✅" });
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
    paymentType, // ✅ ADD PAYMENT TYPE
    location,
    date,
    details,
  } = req.body;

  if (!email || !service) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required data" });
  }

  // Calculate unit price and total
  const unitPrice = amount / (quantity || 1);
  const totalAmount = amount;

  // 1. EMAIL TO CUSTOMER
  const customerMailOptions = {
    from: "ADEQ Water Solutions <adeqtesting@gmail.com>",
    to: email,
    subject: `Booking Confirmation - ${reference}`,
    html: `
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
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Unit Price:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">₦${unitPrice?.toLocaleString?.() || unitPrice}</td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Payment Type:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">${paymentType === "half" ? "50% Deposit" : "Full Payment"}</td>
          </tr>
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Amount ${paymentType === "half" ? "Deposited" : "Paid"}:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">₦${amount?.toLocaleString?.() || amount}</td>
          </tr>
          ${
            paymentType === "half"
              ? `
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Remaining Balance:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">₦${amount?.toLocaleString?.() || amount}</td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Total Amount:</td>
            <td style="padding:10px; border-bottom:1px solid #eee;">₦${totalAmount?.toLocaleString?.() || totalAmount}</td>
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

        ${
          paymentType === "half"
            ? `
        <div style="background:#fff3cd; padding:15px; border-radius:8px; margin:20px 0;">
          <h4 style="color:#856404; margin-top:0;">Payment Notice:</h4>
          <p style="color:#856404;">You have paid a <strong>50% deposit</strong> of ₦${amount?.toLocaleString?.() || amount}.</p>
          <p style="color:#856404;">The remaining balance of <strong>₦${amount?.toLocaleString?.() || amount}</strong> must be paid on site after the survey.</p>
        </div>
        `
            : ""
        }

        <div style="background:#f0f9ff; padding:15px; border-radius:8px; margin:20px 0;">
          <h4 style="color:#0e7490; margin-top:0;">Next Steps:</h4>
          <p>Our team will contact you within <strong>24 hours</strong> to confirm your survey appointment.</p>
          <p>If you have any questions, please contact us at <strong>${phone}</strong>.</p>
        </div>

        <div style="text-align:center; margin-top:30px; padding-top:20px; border-top:1px solid #eee;">
          <p style="color:#666; font-size:14px;">Thank you for choosing ADEQ Water Solutions</p>
          <p style="color:#999; font-size:12px;">Ilorin, Kwara State, Nigeria</p>
        </div>
      </div>
    `,
  };

  // 2. EMAIL TO OWNER
  const ownerMailOptions = {
    from: "ADEQ Booking System <adeqtesting@gmail.com>",
    to: "adeqtesting@gmail.com", // Replace with owner's email
    subject: `🚨 NEW BOOKING: ${service} - ${reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
        <h2 style="color:#dc2626; text-align:center;">NEW BOOKING ALERT! 🚨</h2>
        
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
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Payment Type:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">${paymentType === "half" ? "50% Deposit" : "Full Payment"}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Amount Received:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">₦${amount?.toLocaleString?.() || amount}</td>
            </tr>
            <tr>
              <td style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Total Amount:</td>
              <td style="padding:10px; border-bottom:1px solid #eee;">₦${totalAmount?.toLocaleString?.() || totalAmount}</td>
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

        <div style="background:#dc2626; color:white; padding:15px; border-radius:8px; margin:20px 0;">
          <h4 style="margin-top:0;">ACTION REQUIRED:</h4>
          <p>Contact customer within <strong>24 hours</strong> to confirm appointment.</p>
          <p>Booking received at: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
  };

  try {
    // Send both emails
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(ownerMailOptions),
    ]);

    console.log("✅ Emails sent successfully to both customer and owner!");
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
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
});
