import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

export const createPayment = async (req, res) => {
  try {
    const { order, amount, method } = req.body;

    const payment = await Payment.create({
      order,
      amount,
      method,
      processedBy: req.user._id,
      transactionId: `TXN-${Date.now()}`,
    });

    await Order.findByIdAndUpdate(order, { status: "paid" });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("order")
      .populate("processedBy", "name")
      .sort("-createdAt");
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
