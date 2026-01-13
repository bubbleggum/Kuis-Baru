import { page } from "fresh";
import { define } from "../../../../utils/core.ts";
import { fetchMembers } from "../../../../utils/member_new.ts";
import { MembersList } from "./(_islands)/MembersList.tsx";

export const handler = define.handlers({
	async GET(ctx) {
		const { classroom } = ctx.state;

		if (!classroom) {
			return ctx.redirect("/");
		} else {
			const members = await fetchMembers(classroom.id);
			return page({ classroomId: classroom.id, members });
		}
	},
});

export default define.page<typeof handler>(function (ctx) {
	const { classroomId, members } = ctx.data;

	return <MembersList classroomId={classroomId} initialMembers={members} />;
});
