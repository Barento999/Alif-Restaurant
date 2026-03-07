import Promo from "../models/Promo.js";
import Customer from "../models/Customer.js";

// Get all active promos (public)
export const getActivePromos = async (req, res) => {
  try {
    const now = new Date();
    const promos = await Promo.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ["$usageCount", "$usageLimit"] } },
      ],
    }).select("-usageCount -usageLimit");

    res.json({
      success: true,
      data: promos,
    });
  } catch (error) {
    console.error("Error fetching active promos:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching promos",
    });
  }
};

// Validate promo code
export const validatePromo = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const customerId = req.customer.id;

    if (!code || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: "Promo code and order amount are required",
      });
    }

    const promo = await Promo.findOne({ code: code.toUpperCase() });

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: "Invalid promo code",
      });
    }

    if (!promo.isValid()) {
      return res.status(400).json({
        success: false,
        message: "This promo code has expired or is no longer available",
      });
    }

    if (orderAmount < promo.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of $${promo.minOrderAmount} required`,
      });
    }

    // Check if first order promo
    if (promo.applicableFor === "first_order") {
      const customer = await Customer.findById(customerId);
      const { default: CustomerOrder } =
        await import("../models/CustomerOrder.js");
      const orderCount = await CustomerOrder.countDocuments({
        customer: customerId,
        status: { $in: ["completed", "delivered"] },
      });

      if (orderCount > 0) {
        return res.status(400).json({
          success: false,
          message: "This promo is only valid for first-time orders",
        });
      }
    }

    const discount = promo.calculateDiscount(orderAmount);
    const freeDelivery = promo.type === "free_delivery";

    res.json({
      success: true,
      data: {
        promoId: promo._id,
        code: promo.code,
        title: promo.title,
        discount,
        freeDelivery,
        type: promo.type,
      },
    });
  } catch (error) {
    console.error("Error validating promo:", error);
    res.status(500).json({
      success: false,
      message: "Error validating promo code",
    });
  }
};

// Admin: Get all promos
export const getAllPromos = async (req, res) => {
  try {
    const promos = await Promo.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: promos,
    });
  } catch (error) {
    console.error("Error fetching promos:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching promos",
    });
  }
};

// Admin: Create promo
export const createPromo = async (req, res) => {
  try {
    const promo = new Promo(req.body);
    await promo.save();

    res.status(201).json({
      success: true,
      message: "Promo created successfully",
      data: promo,
    });
  } catch (error) {
    console.error("Error creating promo:", error);
    res.status(500).json({
      success: false,
      message:
        error.code === 11000
          ? "Promo code already exists"
          : "Error creating promo",
    });
  }
};

// Admin: Update promo
export const updatePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: "Promo not found",
      });
    }

    res.json({
      success: true,
      message: "Promo updated successfully",
      data: promo,
    });
  } catch (error) {
    console.error("Error updating promo:", error);
    res.status(500).json({
      success: false,
      message: "Error updating promo",
    });
  }
};

// Admin: Delete promo
export const deletePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: "Promo not found",
      });
    }

    res.json({
      success: true,
      message: "Promo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting promo:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting promo",
    });
  }
};

// Increment usage count (called when order is placed)
export const incrementUsage = async (promoId) => {
  try {
    await Promo.findByIdAndUpdate(promoId, {
      $inc: { usageCount: 1 },
    });
  } catch (error) {
    console.error("Error incrementing promo usage:", error);
  }
};

export default {
  getActivePromos,
  validatePromo,
  getAllPromos,
  createPromo,
  updatePromo,
  deletePromo,
  incrementUsage,
};
