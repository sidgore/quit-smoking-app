import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connectToDatabase";
import { DailyEntry } from "@/lib/models/DailyEntry";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        const dailyEntry = await DailyEntry.findOneAndUpdate(
            { date: new Date(body.date) },
            {
                date: body.date,
                entries: body.answers,
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        return NextResponse.json(dailyEntry);
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create entry" },
            { status: 500 }
        );
    }
}
export async function GET() {
    try {
        await connectToDatabase();
        const entries = await DailyEntry.find().sort({ date: -1 });

        return NextResponse.json(entries);
    } catch (error) {
        console.error("Error submitting form:", error)
        return NextResponse.json(
            { error: "Failed to fetch entries" },
            { status: 500 }
        );
    }
}
