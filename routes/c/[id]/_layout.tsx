import { define } from "../../../utils/core.ts";

export default define.page(function (ctx) {
	const classroom = ctx.state.classroom!;

	function route(pathname: string) {
		return "/c/" + classroom.id + pathname;
	}

	return (
		<div class="flex flex-col px-8 pt-8 gap-8 h-dvh bg-[#111111] select-none font-figtree overflow-y-auto relative">
			<div class="flex flex-col gap-1 text-white">
				<p class="text-2xl font-bold">{classroom.name}</p>
				<div class="flex items-center gap-2">
					{classroom.homeroom.avatar_url && (
						<img
							class="size-6 rounded-full"
							src={classroom.homeroom.avatar_url}
						/>
					)}
					<p class="font-semibold">@{classroom.homeroom.username}</p>
				</div>
			</div>
			<div class="flex flex-col md:flex-row gap-3 grow pb-8 overflow-y-auto md:sticky top-0">
				<div class="flex flex-col gap-2 font-medium md:sticky top-0">
					<a
						class="flex items-center px-4 h-10 gap-3 md:w-64 aria-[current]:bg-[#0A0A0A] text-[#9C9C9C] aria-[current]:text-white rounded-md"
						href={route("/members")}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-users-icon lucide-users"
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<path d="M16 3.128a4 4 0 0 1 0 7.744" />
							<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
							<circle cx="9" cy="7" r="4" />
						</svg>
						<p>Anggota</p>
					</a>
				</div>
				<div class="grow overflow-y-auto bg-[#0A0A0A] rounded-md">
					<ctx.Component />
				</div>
			</div>
		</div>
	);
});
