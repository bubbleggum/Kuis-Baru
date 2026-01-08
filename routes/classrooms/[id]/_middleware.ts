import { fetchClassroom } from "../../../utils/classroom_new.ts";
import { define } from "../../../utils/core.ts";
import { fetchMember } from "../../../utils/member_new.ts";

export const handler = define.middleware(async function (ctx) {
	const { user } = ctx.state;

	if (!user) {
		return ctx.redirect("/");
	} else {
		const { id } = ctx.params;
		const classroom = await fetchClassroom(BigInt(id));
		const member = await fetchMember(BigInt(id), user.id);

		if (classroom && member) {
			ctx.state.classroom = { ...classroom, member };
			return await ctx.next();
		} else {
			return ctx.redirect("/");
		}
	}
});
