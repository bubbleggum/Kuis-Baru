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
    )
    `;
}

export async function createClassroom(
	{ homeroom_id, name }: CreateClassroom,
): Promise<Classroom> {
	const { rows } = await sql.queryObject<Classroom>(
		`insert into classrooms (homeroom_id, name) values ($1, $2) returning *`,
		[homeroom_id, name],
	);
	return rows[0];
}
