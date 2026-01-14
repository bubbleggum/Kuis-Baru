import { HttpError } from "fresh";
import { define } from "../../../../utils/core.ts";
import { STATUS_CODE } from "@std/http/status";
import { MemberRole } from "../../../../schemas/classroom_new.ts";
import { createInvite, fetchInvite } from "../../../../utils/invite.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const classroom = ctx.state.classroom!;

		if (classroom.member.role === MemberRole.Homeroom) {
			const inviteCode = await fetchInvite(classroom.id) ??
				await createInvite(classroom.id);
			return Response.json({ invite_code: inviteCode });
		} else {
			throw new HttpError(STATUS_CODE.Forbidden);
		}
	},
	async PUT(ctx) {
		const classroom = ctx.state.classroom!;

		if (classroom.member.role === MemberRole.Homeroom) {
			const inviteCode = await createInvite(classroom.id);
			return Response.json({ invite_code: inviteCode });
		} else {
			throw new HttpError(STATUS_CODE.Forbidden);
		}
	},
});
