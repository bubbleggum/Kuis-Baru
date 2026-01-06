import { v } from "../utils/valibot.ts";
import { UserSchema } from "./user.ts";

export const ClassroomSchema = v.object({
	created_at: v.date(),
	deleted_at: v.nullable(v.date()),
	homeroom_id: v.bigint(),
	id: v.bigint(),
	name: v.string(),
});
export type Classroom = v.InferOutput<typeof ClassroomSchema>;

export const SafeClassroomSchema = v.object({
	homeroom: v.pick(UserSchema, ["avatar_url", "username"]),
	id: v.bigint(),
	name: v.string(),
});
export type SafeClassroom = v.InferOutput<typeof SafeClassroomSchema>;

export function safeClassroom(classroom: Classroom): SafeClassroom {
	try {
		return v.parse(SafeClassroomSchema, classroom);
	} catch (error) {
		throw error;
	}
}

export const CreateClassroomSchema = v.pick(ClassroomSchema, [
	"name",
]);
export type CreateClassroom = v.InferOutput<typeof CreateClassroomSchema>;

export enum MemberRole {
	Homeroom = "homeroom",
	Teacher = "teacher",
	Student = "student",
}

export const MemberSchema = v.object({
	classroom_id: v.bigint(),
	deleted_at: v.nullable(v.date()),
	joined_at: v.date(),
	member_id: v.bigint(),
	role: v.enum(MemberRole),
});
export type Member = v.InferOutput<typeof MemberSchema>;

export const SafeMemberSchema = v.omit(MemberSchema, ["deleted_at"]);
export type SafeMember = v.InferOutput<typeof SafeMemberSchema>;

export function safeMember(member: Member): SafeMember {
	try {
		return v.parse(SafeMemberSchema, member);
	} catch (error) {
		throw error;
	}
}
