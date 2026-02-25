import { query } from ".";

export async function eventRegistrationOpen() {
  const settings = await query.siteSettings.findFirst();
  return settings?.eventRegistrationsOpen ?? false;
}

export async function findByEventId(id: string) {
  return query.events.findOne({
    where: (e, { eq }) => eq(e.id, id),
  });
}
