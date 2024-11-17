import mongoose, { Schema } from "mongoose";

const DailyEntrySchema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    entries: {
        react_time: { type: String, required: true },
        react_native_time: { type: String, required: true },
        applications_time: { type: String, required: true },
        internshala_time: { type: String, required: true },
        interview_prep_time: { type: String, required: true },
        other_time: { type: String, required: true },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const DailyEntry = mongoose.models.DailyEntry || mongoose.model("DailyEntry", DailyEntrySchema);
