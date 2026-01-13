import { HttpError } from "fresh";
import { define, stringifyJson } from "../../utils/core.ts";
import { STATUS_CODE } from "@std/http/status";
import { fetchClassroomByInvite } from "../../utils/invite.ts";
import { v } from "../../utils/valibot.ts";
import {
	JoinClassroomSchema,
	MemberRole,
} from "../../schemas/classroom_new.ts";
import { createMember } from "../../utils/member_new.ts";
import { ValiError } from "@valibot/valibot";

export interface APIJoinClassroomResult {
	classroom_id: string;
}

export const handler = define.handlers({
	async POST(ctx) {
		const { user } = ctx.state;

		if (!user) {
			throw new HttpError(STATUS_CODE.Unauthorized);
		} else {
			try {
				const { code } = v.parse(
					JoinClassroomSchema,
					await ctx.req.json(),
				);
				const classroomId = await fetchClassroomByInvite(code);

				if (!classroomId) {
					throw new HttpError(
						STATUS_CODE.NotFound,
						"Undangan tidak valid",
					);
				} else {
					await createMember({
						classroom_id: classroomId,
						user_id: user.id,
						role: MemberRole.Student,
					});
					return Response.json(
						JSON.parse(stringifyJson(
							{
								classroom_id: classroomId.toString(),
							} satisfies APIJoinClassroomResult,
						)),
					);
				}
			} catch (error) {
				if (error instanceof ValiError) {
					return Response.json(error.issues);
				} else {
					throw error;
				}
			}
		}
	},
});
