import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  // Destructure user data from request body
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required",
       });
    }

    // Validate user data
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const user = await User.findOne({ email });

    // If user exists
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName: fullName,
      email,
      password: hashedPassword,
    });

    // Save user to database
    if (newUser) {
      // Generate jwt token here
      generateToken(newUser._id, res); // res is passed to generateToken function to create cookie and send it to client, newUser._id is passed to generateToken function to create jwt token

      // Send response to client with user data (excluding password) and jwt token in cookie.
      await newUser.save();
      console.log("New user:", newUser);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => { 
  const { email, password} = req.body;
  try {
    
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    } 

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    } 

    generateToken(user._id, res);

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });

  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
    
  }

};

export const logout = (req, res) => {

try {
   
  res.cookie("jwt", "", { maxAge: 0 }); // Clear jwt cookie here
  res.status(200).json({ message: "Logged out successfully" }); // Send response

} catch (error) {
  console.log("Error in logout controller:", error.message);
  res.status(500).json({
    message: "Internal server error",
  });
  
}};


export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        try {
            // Detailed logging
            console.log('Starting upload with Cloudinary config:', {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY
            });

            const uploadResponse = await cloudinary.uploader.upload(profilePic, {
                folder: 'profile_pics',
                resource_type: 'auto',
                timeout: 120000
            });

            if (!uploadResponse?.secure_url) {
                throw new Error('Failed to get upload URL');
            }

            console.log('Upload successful:', uploadResponse.secure_url);

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: uploadResponse.secure_url },
                { new: true }
            ).select("-password");

            res.status(200).json(updatedUser);
        } catch (uploadError) {
            console.error("Cloudinary upload error details:", uploadError);
            return res.status(500).json({
                message: "Error uploading image",
                error: uploadError.message || 'Unknown upload error'
            });
        }
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
};


export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
    
  }
}