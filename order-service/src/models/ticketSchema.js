import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket
