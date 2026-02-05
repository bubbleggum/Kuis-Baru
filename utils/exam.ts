import { Exam, ExamType } from "../schemas/exam.ts";
import { sql } from "./core.ts";

export async function initExamTable() {
	await sql.query(`
    do $$
    begin
        create type exam_type as enum ('archived', 'locked', 'published');
    exception
        when duplicate_object then
            null;
    end; $$
    `);
	await sql.query(`
    create table if not exists exams (
    author_id bigint not null references users(id),
    classroom_id bigint references classrooms(id),
    created_at timestamp not null default now(),
    deleted_at timestamp,
    ended_at timestamp,
    id bigint generated always as identity primary key,
    questions jsonb not null,
    type exam_type not null
    )
    `);
}

export async function fetchArchives(
	classroomId: bigint,
	authorId: bigint,
) {
	const rows = await sql.query(
		`select * from exams where classroom_id = $1 and author_id = $2 and type = 'archived'`,
		[classroomId, authorId],
	) as Exam<ExamType.Archived>[];
	return rows;
}

export async function fetchExams(classroomId: bigint) {
	const rows = await sql.query(
		`select * from exams where classroom_id = $1`,
		[classroomId],
	) as Exam<ExamType.Archived>[];
	return rows;
}
