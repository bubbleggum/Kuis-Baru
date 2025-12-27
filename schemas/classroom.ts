import { v } from "../utils/valibot.ts";

export const ClassroomSchema = v.object({
	created_at: v.date(),
	deleted_at: v.nullable(v.date()),
	homeroom_id: v.bigint(),
	id: v.bigint(),
	name: v.string(),
});
export type Classroom = v.InferOutput<typeof ClassroomSchema>;

export const CreateClassroomSchema = v.pick(ClassroomSchema, [
	"homeroom_id",
	"name",
]);
export type CreateClassroom = v.InferOutput<typeof CreateClassroomSchema>;
