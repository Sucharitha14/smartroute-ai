// server/models/Trip.js
import mongoose from "mongoose";
 
const tripSchema = new mongoose.Schema(
  {
    source:      { type: String, required: true },
    destination: { type: String, required: true },
    budget:      { type: Number, required: true },
    mood:        { type: String, required: true },
    days:        { type: Number, default: 1 },
    distance:    { type: String },
    budgetBreakdown: {
      transport: Number,
      food:      Number,
      stay:      Number,
    },
    suggestions: [String],
  },
  { timestamps: true }
);
 
const Trip = mongoose.model("Trip", tripSchema);
 
export default Trip;