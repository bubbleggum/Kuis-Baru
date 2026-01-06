import { v } from "../utils/valibot.ts";

export const CreateClassroomSchema = v.object({
	homeroom_id: v.bigint(),
	name: v.string(),
});
export type CreateClassroom = v.InferOutput<typeof CreateClassroomSchema>;

export interface Classroom extends CreateClassroom {
	created_at: Date;
	id: bigint;
}

export enum MemberRole {
	Homeroom = "homeroom",
	Teacher = "teacher",
	Student = "student",
}

export const CreateMemberSchema = v.object({
	classroom_id: v.bigint(),
	member_id: v.bigint(),
	role: v.enum(MemberRole),
});
export type CreateMember = v.InferOutput<typeof CreateMemberSchema>;

export interface Member extends CreateMember {
	deleted_at: Date | null;
	joined_at: Date;
}
