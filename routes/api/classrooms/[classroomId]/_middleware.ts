import { HttpError } from "fresh";
import { define } from "../../../../utils/core.ts";
import { STATUS_CODE } from "@std/http/status";
import { fetchClassroom } from "../../../../utils/classroom_new.ts";
import { fetchMember } from "../../../../utils/member_new.ts";

export const handler = define.middleware(async function (ctx) {
	const { user } = ctx.state;

	if (!user) {
		throw new HttpError(STATUS_CODE.Unauthorized);
	} else {
		const { classroomId } = ctx.params;

		const classroom = await fetchClassroom(BigInt(classroomId));
		const member = await fetchMember(BigInt(classroomId), user.id);

		if (classroom && member) {
			ctx.state.classroom = { ...classroom, member };
			return await ctx.next();
		} else {
			throw new HttpError(STATUS_CODE.NotFound);
		}
	}
});
