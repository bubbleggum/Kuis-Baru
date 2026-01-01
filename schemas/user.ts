import { v } from "../utils/valibot.ts";

export const UserSchema = v.object({
	avatar_url: v.nullable(v.pipe(v.string(), v.url())),
	created_at: v.date(),
	deleted_at: v.nullable(v.number()),
	display_name: v.nullable(v.string()),
	id: v.bigint(),
	password: v.string(),
	username: v.string(),
});
export type User = v.InferOutput<typeof UserSchema>;

export const SafeUserSchema = v.omit(UserSchema, ["password"]);
export type SafeUser = v.InferOutput<typeof SafeUserSchema>;

export function safeUser(user: User) {
	try {
		return v.parse(SafeUserSchema, user);
	} catch (error) {
		throw error;
	}
}

export const CreateUserSchema = v.object({
	password: v.pipe(
		v.string(),
		v.minLength(8, "Minimum password length is 8 characters"),
		v.maxLength(25, "Maximum password length is 25 characters"),
	),
	username: v.pipe(
		v.string(),
		v.regex(
			/^[a-z0-9]{3,20}$/,
			"Username can only have lowercase letters and number and have 3 to 20 character length",
		),
	),
});
export type CreateUser = v.InferOutput<typeof CreateUserSchema>;
