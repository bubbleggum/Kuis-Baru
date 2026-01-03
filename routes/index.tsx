import { page } from "fresh";
import { define } from "../utils/core.ts";

export const handler = define.handlers({
	GET(ctx) {
		const { user } = ctx.state;

		if (user) {
			return page({ user });
		} else {
			return ctx.redirect("/login");
		}
	},
});

export default define.page<typeof handler>(function (ctx) {
	const { user } = ctx.data;

	return (
		<div class="flex flex-col p-8 h-dvh gap-5 bg-[#111111] select-none font-outfit font-semibold relative">
			<div class="flex justify-between">
				<p class="text-white text-lg">Hai, {user.username}!</p>
				<div class="size-10 rounded-full overflow-hidden">
					{user.avatar_url && (
						<img class="size-full" src={user.avatar_url} />
					)}
				</div>
			</div>
			<div class="flex flex-col grow">
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
						<button
							class="flex justify-center items-center bg-[#D5D5D5] size-10 rounded-lg"
							type="button"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#2B2B2B"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-plus-icon lucide-plus"
							>
								<path d="M5 12h14" />
								<path d="M12 5v14" />
							</svg>
						</button>
						<button
							class="flex justify-center items-center bg-[#D5D5D5] size-10 rounded-lg"
							type="button"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#2B2B2B"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-mail-search-icon lucide-mail-search"
							>
								<path d="M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5" />
								<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
								<path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
								<circle cx="18" cy="18" r="3" />
								<path d="m22 22-1.5-1.5" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
});
