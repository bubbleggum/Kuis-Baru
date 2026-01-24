import { pool } from "./core.ts";

export async function initExamTable() {
	using sql = await pool.connect();
	await sql.queryObject`
    do $$
    begin
        create type exam_type as enum ('archived', 'locked', 'published');
    exception
        when duplicate_object then
            null;
    end; $$
    `;
	await sql.queryObject`
    create table if not exists exams (
    author_id bigint not null references users(id),
    classroom_id bigint references classrooms(id),
    created_at timestamp not null default now(),
    deleted_at timestamp,
    ended_at timestamp,
    id bigint generated always as identity primary key,
    type exam_type not null,
    )
    `;
}
