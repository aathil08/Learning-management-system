const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: [true, 'Name is required'], trim: true,
    },
    email: {
      type: String, required: [true, 'Email is required'],
      unique: true, lowercase: true, trim: true,
    },
    password: {
      type: String, required: [true, 'Password is required'],
      minlength: [6, 'Min 6 characters'], select: false,
    },
    role: {
      // 'instructor' is kept internally for backward-compat but treated as admin in UI
      type: String, enum: ['student', 'instructor', 'admin'], default: 'student',
    },
    avatar: { type: String, default: '' },
    bio:    { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
