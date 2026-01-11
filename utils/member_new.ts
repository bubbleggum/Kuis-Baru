import { CreateMember, Member } from "../schemas/classroom_new.ts";
import { User } from "../schemas/user_new.ts";
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
    role member_role not null,
    unique (classroom_id, member_id)
    )
    `;
	await sql.queryArray`
    create unique index if not exists uniq_members on members (classroom_id, member_id)
	`;
}

export async function createMember(data: CreateMember) {
	const { rows } = await sql.queryObject<Member>(
		`insert into members (classroom_id, member_id, role) values ($1, $2, $3) returning *`,
		[data.classroom_id, data.member_id, data.role],
	);
	return rows.at(0)!;
}

export async function fetchMember(classroomId: bigint, memberId: bigint) {
	const { rows } = await sql.queryObject<Member>(
		`select *  from members where classroom_id = $1 and member_id = $2`,
		[classroomId, memberId],
	);
	return rows.at(0) ?? null;
}

export async function fetchMembers(classroomId: bigint) {
	const { rows } = await sql.queryObject<Member & { user: User }>(
		`select m.classroom_id, m.member_id, m.role, json_build_object('avatar_url', u.avatar_url, 'id', u.id, 'username', u.username) as user from members m inner join users u on u.id = m.member_id where m.classroom_id = $1`,
		[classroomId],
	);
	return rows;
}
