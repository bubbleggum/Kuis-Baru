import { page } from "fresh";
import { define } from "../../../utils/core.ts";
import { fetchMembers } from "../../../utils/member_new.ts";
import { MemberItem } from "../../../components/MemberItem.tsx";
import { MemberRole } from "../../../schemas/classroom_new.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const { classroom } = ctx.state;

		if (!classroom) {
			return ctx.redirect("/");
		} else {
			const members = await fetchMembers(classroom.id);
			return page({ members });
		}
	},
});

export default define.page<typeof handler>(function (ctx) {
	const { members } = ctx.data;

	const homerooms = members.filter((member) =>
		member.role == MemberRole.Homeroom
	);
	const teachers = members.filter((member) =>
		member.role == MemberRole.Teacher
	);
	const students = members.filter((member) =>
		member.role == MemberRole.Student
	);

	return (
		<div class="flex flex-col px-6 pb-4 gap-2 text-white overflow-y-auto size-full relative">
			<div class="bg-[#0A0A0A] pt-4 font-bold sticky top-0">
				<p>Wali Kelas</p>
			</div>
			{homerooms.map((member) => (
				<MemberItem key={member.user_id} member={member} />
			))}
			{teachers.length > 0 && (
				<>
					<div class="bg-[#0A0A0A] pt-4 font-bold sticky top-0">
						<p>Guru - {teachers.length}</p>
					</div>
					{teachers.map((member) => (
						<MemberItem key={member.user_id} member={member} />
					))}
				</>
			)}
			{students.length > 0 && (
				<>
					<div class="bg-[#0A0A0A] pt-4 font-bold sticky top-0">
						<p>Murid - {students.length}</p>
					</div>
					{students.map((member) => (
						<MemberItem key={member.user_id} member={member} />
					))}
				</>
			)}
		</div>
	);
});
