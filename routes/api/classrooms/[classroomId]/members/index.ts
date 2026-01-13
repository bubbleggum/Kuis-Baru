import { HttpError } from "fresh";
import { define, stringifyJson } from "../../../../../utils/core.ts";
import { STATUS_CODE } from "@std/http/status";
import { searchMembers } from "../../../../../utils/member_new.ts";
import { Member } from "../../../../../schemas/classroom_new.ts";

export type APISearchMembersResult = Member[];

export const handler = define.handlers({
	async GET(ctx) {
		const { classroom } = ctx.state;

		if (!classroom) {
			throw new HttpError(STATUS_CODE.NotFound);
		} else {
			const username = ctx.url.searchParams.get("username");
			const members = await searchMembers(classroom.id, username ?? "");

			return Response.json(
				JSON.parse(
					stringifyJson(members satisfies APISearchMembersResult),
				),
			);
		}
	},
});
