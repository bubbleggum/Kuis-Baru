import { Classroom, CreateClassroom } from "../schemas/classroom.ts";
import { sql } from "./core.ts";

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
): Promise<Classroom> {
	const { rows } = await sql.queryObject<Classroom>(
		`insert into classrooms (homeroom_id, name) values ($1, $2) returning *`,
		[homeroom_id, name],
	);
	const newClassroom = rows[0];

	await sql.queryObject(
		`insert into members (classroom_id, member_id, role) values ($1, $2, "homeroom")`,
		[newClassroom.id, newClassroom.homeroom_id],
	);

	return newClassroom;
}

export async function fetchClassroom(id: bigint): Promise<Classroom | null> {
	const { rows } = await sql.queryObject<Classroom>(
		`select * from classrooms where id = $1`,
		[id],
	);
	return rows.at(0) ?? null;
}
