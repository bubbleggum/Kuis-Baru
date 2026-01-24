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
			<div class="flex flex-col md:flex-row gap-3 grow pb-8 overflow-y-auto rounded-t-md relative md:sticky top-0">
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
					<a
						class="flex items-center px-4 h-10 gap-3 md:w-64 aria-[current]:bg-[#0A0A0A] text-[#9C9C9C] aria-[current]:text-white rounded-md"
						href={route("/drafts")}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#ffffff"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-book-dashed-icon lucide-book-dashed"
						>
							<path d="M12 17h1.5" />
							<path d="M12 22h1.5" />
							<path d="M12 2h1.5" />
							<path d="M17.5 22H19a1 1 0 0 0 1-1" />
							<path d="M17.5 2H19a1 1 0 0 1 1 1v1.5" />
							<path d="M20 14v3h-2.5" />
							<path d="M20 8.5V10" />
							<path d="M4 10V8.5" />
							<path d="M4 19.5V14" />
							<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H8" />
							<path d="M8 22H6.5a1 1 0 0 1 0-5H8" />
						</svg>
						<p>Draf</p>
					</a>
					<a
						class="flex items-center px-4 h-10 gap-3 md:w-64 aria-[current]:bg-[#0A0A0A] text-red-500 rounded-md"
						href={route("/bans")}
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
							class="lucide lucide-hammer-icon lucide-hammer"
						>
							<path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" />
							<path d="m18 15 4-4" />
							<path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
						</svg>
						<p>Daftar Hitam</p>
					</a>
				</div>
				<div class="grow md:overflow-y-auto bg-[#0A0A0A] sticky md:relative top-0 rounded-md">
					<ctx.Component />
				</div>
			</div>
		</div>
	);
});
