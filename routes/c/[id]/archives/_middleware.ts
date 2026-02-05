import { MemberRole } from "../../../../schemas/classroom_new.ts";
import { define } from "../../../../utils/core.ts";

export const handler = define.handlers(async function (ctx) {
	const { id, member } = ctx.state.classroom!;

	if (member.role === MemberRole.Student) {
		return ctx.redirect("/c/" + id + "/exams");
	} else {
		return await ctx.next();
	}
});
