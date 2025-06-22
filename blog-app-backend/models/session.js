const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    accessToken: {
      type: String,
    },
    refreshToken:{
        type: String,
    },
    type: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    expiryDate: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: "session" }
);

const Session = mongoose.model("session", sessionSchema);
module.exports = Session;
