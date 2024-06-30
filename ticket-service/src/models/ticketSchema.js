import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const ticketSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    default: null,
  },
});

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin)

const Ticket = mongoose.model("Ticket", ticketSchema);

export { Ticket };
