import mongoose from "mongoose";

// One document per counter — e.g. { _id: "invoice", seq: 7 }
const CounterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 },
});

export default mongoose.models.Counter ||
  mongoose.model("Counter", CounterSchema);
