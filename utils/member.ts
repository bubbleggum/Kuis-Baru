import { sql } from "./core.ts";

export async function initMemberTable() {
	await sql.queryObject`
    do $$
    begin
        create type member_role as enum ('homeroom', 'teacher', 'student');
    exception
        when duplicate_object then
            null;
    end; $$
    `;
	await sql.queryObject`
    create table if not exists members (
    classroom_id bigint references classrooms(id),
    deleted_at timestamp,
    joined_at timestamp not null default now(),
    member_id bigint references users(id),
    role member_role not null
    );
    `;
}
