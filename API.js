
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3004; 


app.use(cors({
    origin: ['*', 'http://127.0.0.1:5500', 'http://127.0.0.1:5501', 'http://localhost:5173' ,'https://imanat.netlify.app' ,
     'https://gleeful-lokum-86f064.netlify.app','https://sage-banoffee-082fa9.netlify.app' , 'https://inventory-kwv2.onrender.com']  // Allow both front-end origins
    
}));


app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/inventory')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
});


const Product = mongoose.model('Product', productSchema);

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ data: { products } });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err });
    }
});

//ADD NEW PRODUCT
app.post('/api/products/create', async (req, res) => {
    const { name, quantity } = req.body;

    try {
        const newProduct = new Product({ name, quantity });
        await newProduct.save();
        res.status(201).json({ data: { product: newProduct } });
    } catch (err) {
        res.status(400).json({ message: 'Error adding product', error: err });
    }
});


app.post('/api/products/:id/update_quantity', async (req, res) => {
    const { id } = req.params;
    const { number } = req.query;  // Get the quantity to update from query params

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $inc: { quantity: parseInt(number) } }, // Increment quantity
            { new: true } // Return the updated product
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ data: { product: updatedProduct } });
    } catch (err) {
        res.status(400).json({ message: 'Error updating product quantity', error: err });
    }
});


app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ data: { message: 'Product deleted successfully' } });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting product', error: err });
    }
});

// Warehouse Schema
const warehouseSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    contact: { type: String, required: true },
});


const Warehouse = mongoose.model('Warehouse', warehouseSchema);

// Warehouse Routes

// Get all warehouses
app.get('/api/warehouses', async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        res.json({ success: true, data: warehouses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching warehouses', error });
    }
});

// Add a new warehouse
app.post('/api/warehouses/create', async (req, res) => {
    const { name, location, capacity, contact } = req.body;

    try {
        const newWarehouse = new Warehouse({ name, location, capacity, contact });
        await newWarehouse.save();
        res.status(201).json({ success: true, message: 'Warehouse added successfully', data: newWarehouse });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding warehouse', error });
    }
});

// Update warehouse location
app.put('/api/warehouses/:id', async (req, res) => {
    const { id } = req.params;
    const { location } = req.body;

    try {
        const updatedWarehouse = await Warehouse.findByIdAndUpdate(id, { location }, { new: true });
        if (!updatedWarehouse) {
            return res.status(404).json({ success: false, message: 'Warehouse not found' });
        }
        res.json({ success: true, message: 'Warehouse updated successfully', data: updatedWarehouse });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating warehouse', error });
    }
});

// Delete warehouse
app.delete('/api/warehouses/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const warehouse = await Warehouse.findByIdAndDelete(id);
        if (!warehouse) {
            return res.status(404).json({ success: false, message: 'Warehouse not found' });
        }
        res.json({ success: true, message: 'Warehouse deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting warehouse', error });
    }
});


// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer', 'employee'], required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

// Create a model for User
const User = mongoose.model('User', userSchema);

// User Routes
// Fetch all users
app.get('/api/users', async (req, res) => {
    try {
      const searchQuery = req.query.search || '';
      const users = await User.find(
        searchQuery
          ? { name: { $regex: searchQuery, $options: 'i' } } // Case-insensitive search
          : {}
      );
      res.json({ success: true, data: { users } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Create a user
  app.post('/api/users/create', async (req, res) => {
    try {
      const { name, email, role, password } = req.body;
  
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ success: false, message: 'Name, email, and password are required' });
      }
  
      const newUser = new User({ name, email, role, password });
      await newUser.save();
      res.json({ success: true, message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Update a user
  app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      const user = await User.findByIdAndUpdate(id, updates, { new: true });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.json({ success: true, message: 'User updated successfully', data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Delete a user
  app.delete('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

// Supplier Schema
const supplierSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
});

const Supplier = mongoose.model('Supplier', supplierSchema);

// Routes for handling suppliers

// Get all suppliers
app.get('/api/suppliers', async (req, res) => {
    try {
      const searchQuery = req.query.search || '';
      const suppliers = await Supplier.find(
        searchQuery
          ? { name: { $regex: searchQuery, $options: 'i' } } // Case-insensitive search
          : {}
      );
      res.json({ success: true, data: { suppliers } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
// Create a new supplier
app.post('/api/suppliers/create', async (req, res) => {
    const { name , phone, address , email } = req.body;

    try {
        const newSupplier = new Supplier({ name, phone, address , email });
        await newSupplier.save();
        res.json({ success: true, message: 'Supplier added successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error adding supplier', error: err });
    }
});

//update supplier
app.put('/api/suppliers/update/:id', async (req, res) => {
    const { id } = req.params;  // Get the supplier ID
    const { name, phone, address, email } = req.body;  // Get the data from the request body

    if (!name || !phone || !address || !email) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const supplier = await Supplier.findByIdAndUpdate(id, { name, phone, address, email }, { new: true });
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        res.json({ success: true, message: 'Supplier updated successfully', data: supplier });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



// Delete a supplier by ID
app.delete('/api/suppliers/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findByIdAndDelete(id);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        res.json({ success: true, message: 'Supplier deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting supplier', error: err });
    }
});

// models/Stock.js

const stockSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    warehouse: { type: String, required: true },
    quantity: { type: Number, required: true },
    supplier: { type: String, required: true },
    price: { type: Number, required: true }
}, { timestamps: true });

const Stock = mongoose.model('Stock', stockSchema);

// Routes

// Fetch all stock
app.get('/api/stock', async (req, res) => {
    try {
      const stock = await Stock.find();
      res.json({ success: true, data: { stock } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Add stock
  app.post('/api/stock/create', async (req, res) => {
    try {
      const { productId, productName, category, warehouse, quantity, supplier, price } = req.body;
  
      if (!productId || !productName || !category || !warehouse || !quantity || !supplier || !price) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
  
      const newStock = new Stock({ productId, productName, category, warehouse, quantity, supplier, price });
      await newStock.save();
      res.json({ success: true, message: 'Stock added successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Update stock quantity
  app.put('/api/stock/:name', async (req, res) => {
    try {
      const { name} = req.params;
      const { quantity } = req.body;
  
      if (!quantity) {
        return res.status(400).json({ success: false, message: 'Quantity is required' });
      }
  
      const stock = await Stock.findByIdAndUpdate(name, { quantity }, { new: true });
  
      if (!stock) {
        return res.status(404).json({ success: false, message: 'Stock not found' });
      }
  
      res.json({ success: true, message: 'Stock updated successfully', data: stock });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Delete stock
  app.delete('/api/stock/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const stock = await Stock.findByIdAndDelete(id);
      if (!stock) {
        return res.status(404).json({ success: false, message: 'Stock not found' });
      }
  
      res.json({ success: true, message: 'Stock deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  

// CATEGORY 
// Category Schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const Category = mongoose.model('Category', categorySchema);

// Routes for Categories

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ success: true, data: { categories } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create a new category
app.post('/api/categories/create', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    try {
        const newCategory = new Category({ name });
        await newCategory.save();
        res.json({ success: true, data: newCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update a category
app.put('/api/categories/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    try {
        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a category
app.delete('/api/categories/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});  

// Customer Schema
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'shipped', 'delivered'],
        default: 'pending'
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// API Routes

// Product Routes
app.get('/api/productt', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, data: { products } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/productt', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ success: true, data: { product } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Order Routes
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customerId')
            .populate('items.productId');
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/orders/create', async (req, res) => {
    try {
        // Create customer first
        const customer = new Customer(req.body.customer);
        await customer.save();

        // Calculate total amount
        const totalAmount = req.body.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Create order with customer reference
        const orderData = {
            customerId: customer._id,
            items: req.body.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: totalAmount
        };

        const order = new Order(orderData);
        await order.save();

        // Update product stock
        for (const item of req.body.items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        res.status(201).json({ 
            success: true, 
            data: { order: await order.populate('customerId') }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update order status
app.patch('/api/orders/:orderId/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        ).populate('customerId');
        
        res.json({ success: true, data: { order } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Customer Routes
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json({ success: true, data: { customers } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Something went wrong! Please try again later.' 
    });
});

//LOGIN ROUTE 
//LOGIN ROUTE
// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    // Check if user exists
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
  
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    // Respond with user details (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
