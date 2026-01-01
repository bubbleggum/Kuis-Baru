#!/usr/bin/env -S deno run -A --watch=static/,routes/
import { tailwind } from "@fresh/plugin-tailwind";

import { Builder } from "fresh/dev";
import { initUserTable } from "./utils/user.ts";
import { initClassroomTable } from "./utils/classroom.ts";
import { initMemberTable } from "./utils/member.ts";

const builder = new Builder();
tailwind(builder);
if (Deno.args.includes("build")) {
	await builder.build();

	await initUserTable();
	await initClassroomTable();
	await initMemberTable();
} else {
	await builder.listen(() => import("./main.ts"));
}
