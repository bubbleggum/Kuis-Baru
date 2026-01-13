import { v } from "../utils/valibot.ts";
import { User } from "./user_new.ts";

export const CreateClassroomSchema = v.object({
	homeroom_id: v.bigint(),
	name: v.string(),
});
export type CreateClassroom = v.InferOutput<typeof CreateClassroomSchema>;

export interface Classroom extends CreateClassroom {
	created_at: Date;
	id: bigint;
}
export interface ClassroomWithHomeroom extends Classroom {
	homeroom: User;
}

export enum MemberRole {
	Homeroom = "homeroom",
	Teacher = "teacher",
	Student = "student",
}

export const CreateMemberSchema = v.object({
	classroom_id: v.bigint(),
	user_id: v.bigint(),
	role: v.enum(MemberRole),
});
export type CreateMember = v.InferOutput<typeof CreateMemberSchema>;

export interface Member extends CreateMember {
	id: bigint;
	joined_at: Date;
	user: User;
}

export const InviteSchema = v.object({
	classroom_id: v.bigint(),
	code: v.string(),
});
export type Invite = v.InferOutput<typeof InviteSchema>;

export const JoinClassroomSchema = v.pick(InviteSchema, ["code"]);
export type JoinClassroom = v.InferOutput<typeof JoinClassroomSchema>;
