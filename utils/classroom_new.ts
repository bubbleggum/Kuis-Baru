import {
	Classroom,
	CreateClassroom,
	MemberRole,
} from "../schemas/classroom_new.ts";
import { User } from "../schemas/user_new.ts";
import { sql } from "./core.ts";
import { createMember } from "./member_new.ts";

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

export async function createClassroom(data: CreateClassroom) {
	const { rows } = await sql.queryObject<Classroom>(
		`insert into classrooms (homeroom_id, name) values ($1, $2) returning *`,
		[data.homeroom_id, data.name],
	);
	const newClassroom = rows.at(0)!;

	await createMember({
		classroom_id: newClassroom.id,
		member_id: data.homeroom_id,
		role: MemberRole.Homeroom,
	});

	return newClassroom;
}

export async function fetchClassroom(id: bigint) {
	const { rows } = await sql.queryObject<Classroom & { homeroom: User }>(
		`select c.created_at, c.homeroom_id, c.id, c.name, json_build_object('avatar_url', u.avatar_url, 'created_at', u.created_at, 'id', u.id, 'username', u.username) as homeroom from classrooms c join users u on u.id = c.homeroom_id where c.id = $1`,
		[id],
	);
	return rows.at(0) ?? null;
}

export async function fetchJoinedClassrooms(userId: bigint) {
	const { rows } = await sql.queryObject<Classroom & { homeroom: User }>(
		`select c.created_at, c.homeroom_id, c.id, c.name, json_build_object('avatar_url', u.avatar_url, 'created_at', u.created_at, 'id', u.id, 'username', u.username) as homeroom from classrooms c join members m on m.classroom_id = c.id join users u on u.id = c.homeroom_id where m.member_id = $1 and c.deleted_at is null`,
		[userId],
	);
	return rows;
}
