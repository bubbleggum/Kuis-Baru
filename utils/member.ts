import {
	Member,
	MemberRole,
	SafeMember,
	safeMember,
} from "../schemas/classroom.ts";
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

export async function createMember(
	classroomId: bigint,
	memberId: bigint,
	role: MemberRole = MemberRole.Student,
) {
	const { rows } = await sql.queryObject<Member>(
		`insert into members (classroom_id, member_id, role) values ($1, $2, $3) returning *`,
		[classroomId, memberId, role],
	);
	return safeMember(rows[0]);
}

export async function fetchMember(
	classroomId: bigint,
	memberId: bigint,
): Promise<SafeMember | null> {
	const { rows } = await sql.queryObject<Member>(
		`select * from members where classroom_id = $1 and member_id = $2`,
		[classroomId, memberId],
	);
	const member = rows[0];
	return member && !member.deleted_at ? safeMember(member) : null;
}
