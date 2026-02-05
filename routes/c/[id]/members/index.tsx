import { page } from "fresh";
import { define } from "../../../../utils/core.ts";
import { fetchMembers } from "../../../../utils/member_new.ts";
import { MembersList } from "./(_islands)/MembersList.tsx";
import { createInvite, fetchInvite } from "../../../../utils/invite.ts";
import { MemberRole } from "../../../../schemas/classroom_new.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const { classroom } = ctx.state;

		if (!classroom) {
			return ctx.redirect("/");
		} else {
			const isHomeroom = classroom.member.role === MemberRole.Homeroom;
			const inviteCode = isHomeroom
				? (await fetchInvite(classroom.id) ??
					await createInvite(classroom.id))
				: null;
			const members = await fetchMembers(classroom.id);
			return page({
				classroomId: classroom.id,
				inviteCode,
				isHomeroom,
				members,
			});
		}
	},
});

export default define.page<typeof handler>(function (ctx) {
	const { classroomId, inviteCode, isHomeroom, members } = ctx.data;

	return (
		<MembersList
			classroomId={classroomId}
			initialMembers={members}
			inviteCode={inviteCode}
			isHomeroom={isHomeroom}
		/>
	);
});
