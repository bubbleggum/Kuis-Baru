import { CreateMember, Member } from "../schemas/classroom_new.ts";
import { sql } from "./core.ts";

export async function initMemberTable() {
	await sql.query(`
    do $$
    begin
        create type member_role as enum ('homeroom', 'teacher', 'student');
    exception
        when duplicate_object then
            null;
    end; $$
    `);
	await sql.query(`
    create table if not exists members (
    classroom_id bigint references classrooms(id),
    deleted_at timestamp,
	id bigint generated always as identity primary key,
    joined_at timestamp not null default now(),
    user_id bigint references users(id),
    role member_role not null,
    unique (classroom_id, user_id)
    )
    `);
	await sql.query(`
    create unique index if not exists uniq_members on members (classroom_id, user_id)
	`);
}

export async function createMember(data: CreateMember) {
	const rows = await sql.query(
		`insert into members (classroom_id, user_id, role) values ($1, $2, $3) returning *`,
		[data.classroom_id, data.user_id, data.role],
	) as Member[];
	return rows.at(0)!;
}

export async function fetchMember(classroomId: bigint, userId: bigint) {
	const rows = await sql.query(
		`select m.classroom_id, m.user_id, m.role, m.joined_at, json_build_object('avatar_url', u.avatar_url, 'created_at', u.created_at, 'display_name', u.display_name, 'id', u.id, 'username', u.username) as user from members m join users u on u.id = m.user_id where classroom_id = $1 and user_id = $2`,
		[classroomId, userId],
	) as Member[];
	return rows.at(0) ?? null;
}

export async function fetchMembers(classroomId: bigint) {
	const rows = await sql.query(
		`select m.classroom_id, m.user_id, m.role, m.joined_at, json_build_object('avatar_url', u.avatar_url, 'created_at', u.created_at, 'display_name', u.display_name, 'id', u.id, 'username', u.username) as user from members m join users u on u.id = m.user_id where m.classroom_id = $1 order by role asc`,
		[classroomId],
	) as Member[];
	return rows;
}

export async function searchMembers(classroomId: bigint, username: string) {
	const rows = await sql.query(
		`select m.classroom_id, m.user_id, m.role, m.joined_at, json_build_object('avatar_url', u.avatar_url, 'created_at', u.created_at, 'display_name', u.display_name, 'id', u.id, 'username', u.username) as user from members m join users u on u.id = m.user_id where m.classroom_id = $1 and m.user_id in (select id from users where username ilike $2) order by role asc`,
		[classroomId, username + "%"],
	) as Member[];
	return rows;
}

Deno.test({
	name: "search members",
	async fn() {
		const members = await searchMembers(1n, "B");
		console.log(members);
	},
});
