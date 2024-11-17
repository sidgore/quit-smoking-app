import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connectToDatabase";
import { CiggEntry } from "@/lib/models/CiggEntry";

export async function POST() {
    try {
        await connectToDatabase();

        const entry = await CiggEntry.create({});


        return NextResponse.json(entry);
    } catch (error) {

        console.log('err', error)
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
export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter');

        const now = new Date();
        let query = {};

        switch (filter) {
            case 'today':
                query = {
                    createdAt: {
                        $gte: new Date(now.setHours(0, 0, 0, 0)),
                        $lt: new Date(now.setHours(23, 59, 59, 999))
                    }
                };
                break;
            case '24hours':
                query = {
                    createdAt: {
                        $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000)
                    }
                };
                break;
            case 'week':
                query = {
                    createdAt: {
                        $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    }
                };
                break;
            case 'month':
                query = {
                    createdAt: {
                        $gte: new Date(now.setMonth(now.getMonth() - 1))
                    }
                };
                break;
            case '6months':
                query = {
                    createdAt: {
                        $gte: new Date(now.setMonth(now.getMonth() - 6))
                    }
                };
                break;
            case 'year':
                query = {
                    createdAt: {
                        $gte: new Date(now.setFullYear(now.getFullYear() - 1))
                    }
                };
                break;
            default:
                query = {};
        }


        const entries = await CiggEntry.find(query).sort({ date: -1 });

        return NextResponse.json(entries);
    } catch (error) {
        console.error("Error submitting form:", error)
        return NextResponse.json(
            { error: "Failed to fetch entries" },
            { status: 500 }
        );
    }
}
