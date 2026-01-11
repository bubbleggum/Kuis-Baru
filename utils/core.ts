import { createDefine } from "fresh";
import { Client } from "@db/postgres";
import { envOrThrow } from "@dudasaus/env-or-throw";
import { SafeUser } from "../schemas/user.ts";
import { ClassroomWithHomeroom, Member } from "../schemas/classroom_new.ts";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
	classroom: (ClassroomWithHomeroom & { member: Member }) | null;
	user: SafeUser | null;
}

export const define = createDefine<State>();
export const sql = new Client(envOrThrow("DATABASE_URL"));

export function stringifyJson(data: unknown) {
	return JSON.stringify(
		data,
		(_key, value) => typeof value === "bigint" ? value.toString() : value,
	);
}
