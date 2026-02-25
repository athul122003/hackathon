import type { NextRequest } from "next/server";
import { auth } from "~/auth/event-config";
import { publicRoute } from "~/auth/route-handlers";
import { getAllEvents } from "~/db/services/event-services";
import { successResponse } from "~/lib/response/success";

export const GET = publicRoute(async (_req: NextRequest) => {
  const session = await auth();

  if (session?.eventUser) {
    const events = await getAllEvents(session.eventUser.id);
    return successResponse({ events }, { toast: false });
  }

  const events = await getAllEvents();
  return successResponse({ events }, { toast: false });
});
