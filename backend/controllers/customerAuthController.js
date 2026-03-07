import Customer from "../models/Customer.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id, type: "customer" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new customer
// @route   POST /api/customers/register
// @access  Public
export const registerCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create customer
    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    // Generate token
    const token = generateToken(customer._id);

    res.status(201).json({
      success: true,
      data: {
        _id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        loyaltyPoints: customer.loyaltyPoints,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login customer
// @route   POST /api/customers/login
// @access  Public
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find customer and include password
    const customer = await Customer.findOne({ email }).select("+password");

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if customer is active
    if (!customer.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Check password
    const isPasswordMatch = await customer.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(customer._id);

    res.json({
      success: true,
      data: {
        _id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        loyaltyPoints: customer.loyaltyPoints,
        totalOrders: customer.totalOrders,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get customer profile
// @route   GET /api/customers/profile
// @access  Private (Customer)
export const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update customer profile
// @route   PUT /api/customers/profile
// @access  Private (Customer)
export const updateCustomerProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const customer = await Customer.findById(req.customer.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Update fields
    if (firstName) customer.firstName = firstName;
    if (lastName) customer.lastName = lastName;
    if (phone) customer.phone = phone;

    await customer.save();

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Change customer password
// @route   PUT /api/customers/password
// @access  Private (Customer)
export const changeCustomerPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    const customer = await Customer.findById(req.customer.id).select(
      "+password",
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Check current password
    const isMatch = await customer.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    customer.password = newPassword;
    await customer.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add customer address
// @route   POST /api/customers/addresses
// @access  Private (Customer)
export const addCustomerAddress = async (req, res) => {
  try {
    const { label, street, city, state, zipCode, isDefault } = req.body;

    const customer = await Customer.findById(req.customer.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      customer.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Add new address
    customer.addresses.push({
      label,
      street,
      city,
      state,
      zipCode,
      isDefault: isDefault || customer.addresses.length === 0,
    });

    await customer.save();

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update customer address
// @route   PUT /api/customers/addresses/:addressId
// @access  Private (Customer)
export const updateCustomerAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { label, street, city, state, zipCode, isDefault } = req.body;

    const customer = await Customer.findById(req.customer.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const address = customer.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If setting as default, unset others
    if (isDefault) {
      customer.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Update address
    if (label) address.label = label;
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await customer.save();

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete customer address
// @route   DELETE /api/customers/addresses/:addressId
// @access  Private (Customer)
export const deleteCustomerAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const customer = await Customer.findById(req.customer.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    customer.addresses.pull(addressId);
    await customer.save();

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
