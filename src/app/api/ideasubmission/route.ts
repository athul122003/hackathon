import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";
import { submitIdea } from "~/db/services/idea-services";
import { AppError } from "~/lib/errors/app-error";

export async function POST(req: Request) {
    const { teamId, pdfUrl, trackId } = await req.json();
    const session = useSession();
    if (!session.data?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const result = await submitIdea({ teamId, pdfUrl, trackId, userId: session.data.user.id });
        return NextResponse.json({ success: true, result });
    }
    catch (e) {
        if (e instanceof AppError) {
            return NextResponse.json({ error: e.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}