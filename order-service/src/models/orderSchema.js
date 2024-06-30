import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model("Order", orderSchema);

export default Order