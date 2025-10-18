const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//defining the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        trim: true,
        default: null,
        sparse: true,   // ✅ important to allow multiple nulls
        unique: false   // ✅ remove uniqueness
    },


    password: {
        type: String,
        required: true
    },
    phone: {
        // type: Number,
        type: String,
        required: true
    },
    address: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        street: { type: String }, // Optional street details
        pincode: { type: String, required: true, match: [/^\d{6}$/, 'Pincode must be 6 digits'] }
    },
    
    // ✅ NEW: Add 'sex' with predefined options for data consistency
    sex: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    
    // ✅ IMPROVEMENT: Use a single 'relative' object for S/O, W/O, D/O etc.
    relative: {
        relationType: {
            type: String,
            enum: ['S/O', 'W/O', 'D/O'], // Son Of, Wife Of, Daughter Of
            required: true
        },
        relativeName: {
            type: String,
            required: true
        }
    },
    addharCardNumber: {
        // type: Number,
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    dob: {
        type: Date,
        required: true
    },
    profilePhoto: {
        type: String,
        required: true // or false if optional
    }



}, { timestamps: true });

// pre is a middleware function that runs before the save operation
// It is used to hash the password before saving the person document to the database
userSchema.pre('save', async function (next) {

    const user = this;

    // Check if the password is modified
    if (!user.isModified('password')) {
        return next(); // If not modified, proceed to the next middleware
    }
    try {
        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10); // genSault generates a salt for hashing the password
        // The number 10 is the cost factor, which determines how much time is needed to
        // hash the password with the generated salt
        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword; // Set the hashed password
        next(); // Proceed to the next middleware
    } catch (error) {
        return next(error); // Pass any error to the next middleware
    }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        console.log('Comparing candidate password with stored password...');
        console.log(this.password);
        // Compare the candidate password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log('Password comparison result:', isMatch);
        return isMatch; // Return true if passwords match, false otherwise
    }
    catch (error) {
        throw error; // Throw any error that occurs during comparison
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;