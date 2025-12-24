import { v } from "../utils/valibot.ts";

export const UserSchema = v.object({
	avatar_url: v.nullable(v.pipe(v.string(), v.url())),
	created_at: v.date(),
	deleted_at: v.nullable(v.number()),
	display_name: v.nullable(v.string()),
	id: v.number(),
	password: v.string(),
	username: v.string(),
});
export type User = v.InferOutput<typeof UserSchema>;

export const CreateUserSchema = v.pick(UserSchema, ["password", "username"]);
export type CreateUser = v.InferOutput<typeof CreateUserSchema>;
