import { Invite } from "../schemas/classroom_new.ts";
import { sql } from "./core.ts";
import { customAlphabet } from "@sitnik/nanoid";

const inviteFn = customAlphabet(
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
);

export async function initInviteTable() {
	await sql.queryObject`
    create table if not exists invites (
    classroom_id bigint references classrooms(id) unique,
    code text unique not null
    );
    `;
}

export async function createInvite(classroomId: bigint) {
	let codeSize = 8;
	let success = false;
	let retries = 0;

	do {
		try {
			const { rows } = await sql.queryObject<Invite>(
				`insert into invites (classroom_id, code) values ($1, $2) on conflict (classroom_id) do update set code = excluded.code returning *`,
				[classroomId, inviteFn(codeSize++)],
			);
			success = true;
			return rows.at(0)!.code;
		} catch (_error) {
			retries++;
		}
	} while (retries < 5 && !success);

	throw new Error(
		"Failed to create invite for classroom id: " + classroomId.toString(),
	);
}

export async function fetchInvite(classroomId: bigint) {
	const { rows } = await sql.queryObject<Invite>(
		`select code from invites where classroom_id = $1`,
		[classroomId],
	);
	return rows.at(0)?.code ?? null;
}

Deno.test({
	name: "upsert and fetch invite",
	async fn() {
		const classroomId = 5n;

		console.log("upserting invite...");
		const newInvite = await createInvite(classroomId);
		console.log(newInvite);

		console.log("fetching invite...");
		console.log(await fetchInvite(classroomId));

		await sql.end();
	},
});
