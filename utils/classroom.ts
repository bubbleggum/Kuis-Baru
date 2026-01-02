import {
	Classroom,
	CreateClassroom,
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
	{ homeroom_id, name }: CreateClassroom,
): Promise<SafeClassroom> {
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

	return safeClassroom(newClassroom);
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
