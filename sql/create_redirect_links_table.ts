import { client } from '../connections/db_connection'

export async function createRedirectLinksTable() {
    try {
        await client.query(
            `create table if not exists redirect_links (
                id bigserial primary key,
                short_code varchar(32) not null unique,
                original_url text not null,
                created_at timestamptz not null default now(),
                click_count integer not null default 0
            )`
        )
    } catch (error) {
        console.log('[DB] Failed to create redirect_links table', error)
    }
}