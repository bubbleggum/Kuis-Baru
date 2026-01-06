import {
	Classroom,
	MemberRole,
	SafeClassroom,
	safeClassroom,
} from "../schemas/classroom.ts";
import { sql } from "./core.ts";
import { createMember } from "./member.ts";

export async function initClassroomTable() {
	await sql.queryArray`
    create table if not exists classrooms (
    created_at timestamp not null default now(),
    deleted_at timestamp,
    homeroom_id bigint references users(id),
    id bigint generated always as identity primary key,
    name text not null
    );
    `;
}

export async function createClassroom(
	name: string,
	homeroom_id: bigint,
): Promise<Classroom> {
	const { rows } = await sql.queryObject<Classroom>(
		`insert into classrooms (homeroom_id, name) values ($1, $2) returning *`,
		[homeroom_id, name],
	);
	const newClassroom = rows[0];

	await createMember(
		newClassroom.id,
		newClassroom.homeroom_id,
		MemberRole.Homeroom,
	);

	return newClassroom;
}

export async function fetchClassroom(
	id: bigint,
): Promise<SafeClassroom | null> {
	const { rows } = await sql.queryObject<Classroom>(
		`select * from classrooms where id = $1`,
		[id],
	);
	const classroom = rows[0];

	return classroom && !classroom.deleted_at ? safeClassroom(classroom) : null;
}

export async function fetchJoinedClassrooms(
	userId: bigint,
) {
	const { rows } = await sql.queryObject<SafeClassroom>(
		`select c.id, c.name, json_build_object('avatar_url', u.avatar_url, 'username', u.username) as homeroom from classrooms c join members m on m.classroom_id = c.id join users u on u.id = c.homeroom_id where m.member_id = $1`,
		[userId],
	);
	return rows;
}
