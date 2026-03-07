import CustomerOrder from "../models/CustomerOrder.js";
import Customer from "../models/Customer.js";

// @desc    Create new customer order
// @route   POST /api/customer-orders
// @access  Private (Customer)
export const createCustomerOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      contactPhone,
      subtotal,
      deliveryFee,
      tax,
      total,
      notes,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (
      !items ||
      items.length === 0 ||
      !deliveryAddress ||
      !contactPhone ||
      !subtotal ||
      !total
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Create order
    const order = await CustomerOrder.create({
      customer: req.customer._id,
      items,
      deliveryAddress,
      contactPhone,
      subtotal,
      deliveryFee: deliveryFee || 5.0,
      tax,
      total,
      notes,
      paymentMethod: paymentMethod || "cash",
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    });

    // Update customer stats
    await Customer.findByIdAndUpdate(req.customer._id, {
      $inc: {
        totalOrders: 1,
        totalSpent: total,
        loyaltyPoints: Math.floor(total), // 1 point per dollar
      },
    });

    // Populate order details
    const populatedOrder = await CustomerOrder.findById(order._id)
      .populate("customer", "firstName lastName email phone")
      .populate("items.menuItem", "name category");

    res.status(201).json({
      success: true,
      data: populatedOrder,
      message: "Order placed successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get customer's orders
// @route   GET /api/customer-orders
// @access  Private (Customer)
export const getCustomerOrders = async (req, res) => {
  try {
    const orders = await CustomerOrder.find({ customer: req.customer._id })
      .populate("items.menuItem", "name category")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/customer-orders/:id
// @access  Private (Customer)
export const getCustomerOrder = async (req, res) => {
  try {
    const order = await CustomerOrder.findOne({
      _id: req.params.id,
      customer: req.customer._id,
    })
      .populate("customer", "firstName lastName email phone")
      .populate("items.menuItem", "name category");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/customer-orders/:id/cancel
// @access  Private (Customer)
export const cancelCustomerOrder = async (req, res) => {
  try {
    const order = await CustomerOrder.findOne({
      _id: req.params.id,
      customer: req.customer._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Can only cancel pending or confirmed orders
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order in current status",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      success: true,
      data: order,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
