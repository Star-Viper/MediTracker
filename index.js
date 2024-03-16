require('dotenv').config();
const express = require('express');
const app = express();
const mongoConnect = require('./db');
const cors = require('cors');
const Product = require('./models/Products');
const User = require('./models/User');
const bcrypt = require('bcryptjs')
const port = 4000;

app.use(cors());
app.use(express.json());

app.post('/post', async (req, res) => {
  const { productID, prdName, batchNo, qrcode, manufactureDate, expirationDate } = req.body;
  if (!productID || !qrcode || !expirationDate) {
    return res.status(422).json({ error: 'All Fields Are Required!' });
  }
  try {
    const existingPrd = await Product.findOne({ batchNo: batchNo });

    if (existingPrd) {
      return res.status(422).json({ error: "batchNo already exists!" });
    }

    const product = new Product({
      productID, prdName, batchNo, qrcode, manufactureDate, expirationDate
    });
    const item = await product.save();
    return res.status(200).json({ message: 'Product Added successfully!', item });
  } catch (err) {
    console.error(`Error sending message: ${err}`);
    return res.status(500).json({ error: `Internal Server Error -> ${err}` });
  }
})


app.post('/register', async (req, res) => {
  const { username, userRole, address, password } = req.body;
  if (!username || !userRole || !address) {
    return res.status(422).json({ error: 'All Fields Are Required!' });
  }
  try {
    const existingUser = await User.findOne({ address: address });

    if (existingUser) {
      return res.status(422).json({ error: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const USER = new User({
      username, userRole, address, password: hashedPassword
    });
    const user = await USER.save();
    return res.status(200).json({ message: 'User Registered successfully!', user });
  } catch (err) {
    console.error(`Error sending message: ${err}`);
    return res.status(500).json({ error: `Internal Server Error -> ${err}` });
  }
})



app.post('/login', async (req, res) => {
  const { address, password } = req.body;

  if (!address || !password) {
      return res.status(422).json({ error: "Please provide a valid email and password" });
  }

  try {
      
      const user = await User.findOne({ address:address });
      if (!user) {
          return res.status(422).json({ error: "Invalid address or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
          return res.status(200).json({
              user: user,
              message: "Login successful",
          });
      } else {
          return res.status(404).json({ error: "Invalid Credentials!!!" });
      }
  } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
  }
})



app.get('/fetch/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const ans = await Product.findOne({ productID: id });
    if (ans) {
      return res.status(200).json({ message: "true", ans });
    }
    else {
      return res.status(404).json({ message: "Product Not Found" });
    }
  } catch (err) {
    console.error(`Error sending message: ${err}`);
    return res.status(500).json({ error: `Internal Server Error -> ${err}` });
  }
})


app.get('/get', async (req, res) => {
  try {
    const ans = await Product.find({ distributor: false });
    console.log(ans);
    return res.status(200).json({ ans });
  } catch (err) {
    console.error(`Error sending message: ${err}`);
    return res.status(500).json({ error: `Internal Server Error -> ${err}` });
  }
});



app.put('/sold/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { productID: productId },
      { distributor: true },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({ message: `Product ${productId} is marked as sold` });
  } catch (error) {
    console.error(`Error marking product as sold: ${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/solded/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      { purchased: 1 },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Failed to Update' });
    }

    return res.status(200).json({ message: `Product ${id} is marked as sold` });
  } catch (error) {
    console.error(`Error marking product as sold: ${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/dgetSold', async (req, res) => {
  try {
    const ans = await Product.find({ Retailer: false });
    return res.status(200).json({ ans });
  } catch (err) {
    console.error(`Error sending message: ${err}`);
    return res.status(500).json({ error: `Internal Server Error -> ${err}` });
  }
});


app.get('/retailer_get_distributor', async (req, res) => {
  try {
    const ans = await Product.find({ purchased:0 });
    return res.status(200).json({ ans });
  } catch (err) {
    console.error(`Error sending message: ${err}`);
    return res.status(500).json({ error: `Internal Server Error -> ${err}` });
  }
});


app.put('/dgetSold/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { productID: productId },
      { Retailer: true },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({ message: `Product ${productId} is marked as sold` });
  } catch (error) {
    console.error(`Error marking product as sold: ${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


mongoConnect(process.env.MONGO_URL).then(() => {

  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error(err);
  process.exit(1);
});