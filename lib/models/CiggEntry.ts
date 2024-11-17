import mongoose, { Schema } from "mongoose";

const CiggEntrySchema = new Schema({

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const CiggEntry = mongoose.models.CiggEntry || mongoose.model("CiggEntry", CiggEntrySchema);
