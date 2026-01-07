import { page } from "fresh";
import { define } from "../utils/core.ts";
import { CreateClassroomIsland } from "../islands/CreateClassroom.tsx";
import { fetchJoinedClassrooms } from "../utils/classroom_new.ts";
import { ClassroomItem } from "../components/ClassroomItem.tsx";
import { JoinClassroomIsland } from "../islands/JoinClassroom.tsx";

export const handler = define.handlers({
	async GET(ctx) {
		const { user } = ctx.state;

		if (user) {
			const classrooms = await fetchJoinedClassrooms(user.id);

			return page({
				classrooms,
				user,
			});
		} else {
			return ctx.redirect("/login");
		}
	},
});

export default define.page<typeof handler>(function (ctx) {
	const { classrooms, user } = ctx.data;

	return (
		<div class="flex flex-col p-8 h-dvh gap-5 bg-[#111111] select-none font-outfit font-semibold overflow-y-auto relative">
			<div class="flex justify-between">
				<p class="text-white text-lg">Hai, {user.username}!</p>
				<div class="size-10 rounded-full overflow-hidden">
					{user.avatar_url && (
						<img class="size-full" src={user.avatar_url} />
					)}
				</div>
			</div>
			<div class="flex flex-col gap-4 grow">
				<div class="flex justify-between gap-3">
					<div class="flex items-center grow relative">
						<input
							class="bg-[#1B1B1B] w-full max-w-80 pl-11 pr-3 h-10 text-sm text-white placeholder:text-[#565656] rounded-lg outline-none"
							placeholder="Cari Kelas..."
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#565656"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-search-icon lucide-search absolute left-3"
						>
							<path d="m21 21-4.34-4.34" />
							<circle cx="11" cy="11" r="8" />
						</svg>
					</div>
					<div class="flex gap-2">
						<CreateClassroomIsland />
						<JoinClassroomIsland />
					</div>
				</div>
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto">
					{classrooms.map((classroom) => (
						<ClassroomItem classroom={classroom} />
					))}
				</div>
			</div>
		</div>
	);
});
