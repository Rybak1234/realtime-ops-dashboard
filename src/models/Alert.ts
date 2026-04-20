import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  name: string;
  condition: {
    metric: string;
    operator: string;
    threshold: number;
  };
  severity: "low" | "medium" | "high" | "critical";
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    name: { type: String, required: true },
    condition: {
      metric: { type: String, required: true },
      operator: { type: String, required: true },
      threshold: { type: Number, required: true },
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Alert || mongoose.model<IAlert>("Alert", AlertSchema);
