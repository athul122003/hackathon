import { eq } from "drizzle-orm";
import db from "..";
import { ideaSubmission, teams } from "../schema";
import { AppError } from "~/lib/errors/app-error";

export async function submitIdea({ teamId, pdfUrl, trackId, userId }: { teamId: string; pdfUrl: string; trackId: string; userId: string }) {
    try {
        const leader = await db.query.teams.findFirst({
            where: eq(teams.id, teamId),
            columns: {
                leaderId: true
            }
        });
        if (!leader || !(leader.leaderId == userId)) {
            throw new AppError("You are not the leader of this team", 400);
        }
        const [submitIdea] = await db.insert(ideaSubmission).values({
            teamId,
            pptUrl: pdfUrl,
            trackId,
        }).returning();
        const res = submitIdea
        return res;
    }
    catch (error) {
        console.error("Error submitting idea:", error);
        throw new AppError("Failed to submit idea", 500);
    }
}