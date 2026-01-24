import { v } from "../utils/valibot.ts";

const QuestionSchema = v.object({
	choices: v.pipe(v.array(v.string()), v.maxLength(5)),
	correct_choice_id: v.bigint(),
	exam_id: v.bigint(),
	question_id: v.bigint(),
	title: v.string(),
});
export type Question = v.InferOutput<typeof QuestionSchema>;

export enum ExamType {
	Archived = "archived",
	Locked = "locked",
	Published = "published",
}

export const ExamSchema = v.object({
	author_id: v.bigint(),
	classroom_id: v.bigint(),
	created_at: v.date(),
	deleted_at: v.nullable(v.date()),
	ended_at: v.nullable(v.date()),
	id: v.bigint(),
	questions: v.array(QuestionSchema),
	title: v.string(),
	type: v.enum(ExamType),
});
export type Exam = v.InferOutput<typeof ExamSchema>;

export const ExamSubmissionSchema = v.object({
	classroom_id: v.bigint(),
	exam_id: v.bigint(),
	choices: v.array(v.number()),
	submitted_at: v.date(),
	submitter_id: v.bigint(),
});
export type ExamSubmission = v.InferOutput<typeof ExamSubmissionSchema>;
