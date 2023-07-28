const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');



const register = async (req, res) => {
    const { email, name, password } = req.body;
  
    try {
      // Check if the user with the same email already exists in the database
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        // If a user with the same email already exists, send an error response
        return res.status(409).json({ message: 'User with this email already exists' });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // If the user with the same email does not exist, create a new user
      const newUser = await User.create({ email, name, password:hashedPassword });
      console.log(newUser);
  
      // You can choose to send a success response with the newly created user data
      return res.status(201).json(newUser);
    } catch (error) {
      // Handle any error that occurred during the user creation process
      return res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }



  const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email in the database
      const user = await User.findOne({ email });
      if (!user) {
        // If the user with the provided email does not exist, send an error response
        return res.status(404).json({ message: 'User not found' });
      }
  
      // If the user exists, compare the provided password with the stored hashed password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
  
      if (!isPasswordMatch) {
        // If the passwords do not match, send an error response
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // At this point, the email and password match, so the user is authenticated.
      // You can generate a token here (if you are using authentication tokens) and send it as part of the response.
      // For simplicity, we'll just send a success response here.

      console.log(user);
      const payload = {
        id:user._id,
        name:user.name,
        email: user.email,
      }
      const token = jwt.sign(payload, 'secretk');
      const user_data = {
        _id:user._id,
        name:user.name,
        email:user.email,
      }
      return res.status(200).json({ message: 'Login successful' , user_data , token});
    } catch (error) {
      // Handle any error that occurred during the login process
      return res.status(500).json({ message: 'Error during login', error: error.message });
    }
  }


  const tokenValidator = async (req, res) => {
    const Authtoken = req.header('Authorization');
    const token = Authtoken.split("Bearer ")[1];
    console.log(token, "maaro muje maaro")
   try {
    const decoded = jwt.verify(token, 'secretk');
    console.log(decoded, "karo kaor")
    // If the token is valid, you can perform further actions or checks here
    // For example, you might want to check if the user exists in the database or has certain permissions

    return res.status(200).json({ message: 'Token is valid', decoded });
  } catch (error) {
    // If the token is invalid or has expired, jwt.verify will throw an error
    return res.status(401).json({ message: 'Invalid token' });
  }
   
  }

  module.exports = {register, login, tokenValidator};