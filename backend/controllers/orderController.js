import Order from "../models/Order.js";
import Table from "../models/Table.js";

export const createOrder = async (req, res) => {
  try {
    const { table, items, notes } = req.body;

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const orderNumber = `ORD-${Date.now()}`;

    const order = await Order.create({
      orderNumber,
      table,
      waiter: req.user._id,
      items,
      subtotal,
      tax,
      total,
      notes,
    });

    await Table.findByIdAndUpdate(table, { status: "occupied" });

    const populatedOrder = await Order.findById(order._id)
      .populate("table")
      .populate("waiter", "name")
      .populate("items.menuItem");

    req.io.emit("newOrder", populatedOrder);

    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status, limit } = req.query;
    const filter = status ? { status } : {};

    let query = Order.find(filter)
      .populate("table")
      .populate("waiter", "name")
      .populate("items.menuItem")
      .sort("-createdAt");

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const orders = await query;

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const currentStatus = order.status;

    // Define valid status transitions
    const statusWorkflow = {
      pending: ["preparing", "cancelled"],
      preparing: ["ready", "cancelled"],
      ready: ["served"],
      served: ["paid"],
      paid: [], // Terminal state - cannot change
      cancelled: [], // Terminal state - cannot change
    };

    // Check if status change is allowed
    const allowedTransitions = statusWorkflow[currentStatus];

    // Prevent changes from terminal states
    if (allowedTransitions.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from "${currentStatus}". This is a final state.`,
      });
    }

    // Check if the new status is a valid transition
    if (!allowedTransitions.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from "${currentStatus}" to "${status}". Allowed: ${allowedTransitions.join(", ")}`,
      });
    }

    // Update status (timestamp will be set by pre-save middleware)
    order.status = status;
    await order.save();

    // Free table when paid
    if (status === "paid") {
      await Table.findByIdAndUpdate(order.table, { status: "available" });
    }

    // Free table when cancelled
    if (status === "cancelled") {
      await Table.findByIdAndUpdate(order.table, { status: "available" });
    }

    const populatedOrder = await Order.findById(order._id)
      .populate("table")
      .populate("waiter", "name")
      .populate("items.menuItem");

    req.io.emit("orderStatusUpdate", populatedOrder);

    res.json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    // Only admin can delete orders
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can delete orders",
      });
    }

    // Require deletion reason
    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please provide a reason for deletion (minimum 5 characters)",
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Log deletion for audit trail
    console.log(`[ORDER DELETION] Admin: ${req.user.name} (${req.user.email})`);
    console.log(`Order: ${order.orderNumber} | Status: ${order.status}`);
    console.log(`Reason: ${reason}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);

    // Free the table if order is not paid
    if (order.status !== "paid") {
      await Table.findByIdAndUpdate(order.table, { status: "available" });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Order deleted successfully",
      deletedBy: req.user.name,
      reason: reason,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("table")
      .populate("waiter", "name")
      .populate("items.menuItem");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order (waiter only, pending orders)
// @route   PUT /api/orders/:id/cancel
// @access  Private (Waiter/Admin/Manager)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order belongs to this waiter (unless admin/manager)
    const orderWaiterId = order.waiter?.toString();
    const currentUserId = req.user._id.toString();
    const isAdminOrManager = ["admin", "manager"].includes(req.user.role);

    if (!isAdminOrManager && orderWaiterId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own orders",
      });
    }

    // Can only cancel pending orders
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Can only cancel pending orders (before kitchen starts)",
      });
    }

    order.status = "cancelled";
    await order.save();

    // Free up the table if it was occupied
    if (order.table) {
      await Table.findByIdAndUpdate(order.table, { status: "available" });
    }

    const populatedOrder = await Order.findById(order._id)
      .populate("table")
      .populate("waiter", "name")
      .populate("items.menuItem");

    // Emit socket event
    if (req.io) {
      req.io.emit("orderStatusUpdate", populatedOrder);
    }

    res.json({
      success: true,
      data: populatedOrder,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Modify order items (waiter only, pending orders)
// @route   PUT /api/orders/:id/modify
// @access  Private (Waiter/Admin/Manager)
export const modifyOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide items to update",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order belongs to this waiter (unless admin/manager)
    const orderWaiterId = order.waiter?.toString();
    const currentUserId = req.user._id.toString();
    const isAdminOrManager = ["admin", "manager"].includes(req.user.role);

    if (!isAdminOrManager && orderWaiterId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only modify your own orders",
      });
    }

    // Can only modify pending orders (before kitchen starts preparing)
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot modify order once kitchen has started preparing. Only pending orders can be modified.",
      });
    }

    // Store previous state for modification history
    const previousItems = [...order.items];
    const previousTotal = order.total;

    // Calculate new totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.1;
    const newTotal = subtotal + tax;

    // Add to modification history
    if (!order.modificationHistory) {
      order.modificationHistory = [];
    }

    order.modificationHistory.push({
      modifiedBy: req.user._id,
      modifiedAt: new Date(),
      previousItems: previousItems,
      newItems: items,
      previousTotal: previousTotal,
      newTotal: newTotal,
      reason: "Order items modified",
    });

    // Update items and totals
    order.items = items;
    order.subtotal = subtotal;
    order.tax = tax;
    order.total = newTotal;

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("table")
      .populate("waiter", "name")
      .populate("items.menuItem")
      .populate("modificationHistory.modifiedBy", "name");

    // Emit socket event
    if (req.io) {
      req.io.emit("orderStatusUpdate", populatedOrder);
    }

    // Log modification for audit trail
    console.log(
      `[ORDER MODIFICATION] User: ${req.user.name} (${req.user.role})`,
    );
    console.log(`Order: ${order.orderNumber}`);
    console.log(`Previous Total: $${previousTotal.toFixed(2)}`);
    console.log(`New Total: $${newTotal.toFixed(2)}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);

    res.json({
      success: true,
      data: populatedOrder,
      message: "Order updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order notes
// @route   PATCH /api/orders/:id/notes
// @access  Private (Staff)
export const updateOrderNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update notes
    order.notes = notes;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("table")
      .populate("waiter", "name")
      .populate("items.menuItem");

    // Log notes update for audit trail
    console.log(
      `[ORDER NOTES UPDATE] User: ${req.user.name} (${req.user.role})`,
    );
    console.log(`Order: ${order.orderNumber}`);
    console.log(`Notes: ${notes || "(removed)"}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);

    res.json({
      success: true,
      data: populatedOrder,
      message: "Order notes updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reassign order to different waiter
// @route   PATCH /api/orders/:id/reassign
// @access  Private (Manager/Admin)
export const reassignOrder = async (req, res) => {
  try {
    const { waiterId } = req.body;

    if (!waiterId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a waiter ID",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const previousWaiter = order.waiter;

    // Update waiter
    order.waiter = waiterId;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("table")
      .populate("waiter", "name")
      .populate("items.menuItem");

    // Log reassignment for audit trail
    console.log(
      `[ORDER REASSIGNMENT] Manager: ${req.user.name} (${req.user.role})`,
    );
    console.log(`Order: ${order.orderNumber}`);
    console.log(`Previous Waiter ID: ${previousWaiter}`);
    console.log(`New Waiter: ${populatedOrder.waiter?.name} (${waiterId})`);
    console.log(`Timestamp: ${new Date().toISOString()}`);

    // Emit socket event
    if (req.io) {
      req.io.emit("orderReassigned", populatedOrder);
    }

    res.json({
      success: true,
      data: populatedOrder,
      message: "Order reassigned successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order priority
// @route   PATCH /api/orders/:id/priority
// @access  Private (Manager/Admin)
export const updateOrderPriority = async (req, res) => {
  try {
    const { priority } = req.body;

    if (!priority || !["normal", "high", "urgent"].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid priority (normal, high, urgent)",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const previousPriority = order.priority || "normal";

    // Update priority
    order.priority = priority;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("table")
      .populate("waiter", "name")
      .populate("items.menuItem");

    // Log priority change for audit trail
    console.log(
      `[ORDER PRIORITY UPDATE] User: ${req.user.name} (${req.user.role})`,
    );
    console.log(`Order: ${order.orderNumber}`);
    console.log(`Priority: ${previousPriority} → ${priority}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);

    // Emit socket event
    if (req.io) {
      req.io.emit("orderPriorityUpdate", populatedOrder);
    }

    res.json({
      success: true,
      data: populatedOrder,
      message: "Order priority updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
