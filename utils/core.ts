import { createDefine } from "fresh";
import { Client } from "@db/postgres";
import { envOrThrow } from "@dudasaus/env-or-throw";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
	shared: string;
}

export const define = createDefine<State>();
export const sql = new Client(envOrThrow("DATABASE_URL"));
