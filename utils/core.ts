import { createDefine } from "fresh";
import { neon } from "@neon/serverless";
import { envOrThrow } from "@dudasaus/env-or-throw";
import { ClassroomWithHomeroom, Member } from "../schemas/classroom_new.ts";
import { User } from "../schemas/user_new.ts";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
	classroom: (ClassroomWithHomeroom & { member: Member }) | null;
	user: User | null;
}

export const define = createDefine<State>();
export const sql = neon(envOrThrow("DATABASE_URL"));

export function stringifyJson(data: unknown) {
	return JSON.stringify(
		data,
		(_key, value) => typeof value === "bigint" ? value.toString() : value,
	);
}
