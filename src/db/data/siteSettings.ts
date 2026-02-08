import { query } from ".";

export async function getSiteSettings() {
    return query.siteSettings.findFirst(); // TODO: CHECK WORKING
}
