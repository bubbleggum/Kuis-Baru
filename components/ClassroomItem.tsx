import { SafeClassroom } from "../schemas/classroom.ts";

export function ClassroomItem({ classroom }: { classroom: SafeClassroom }) {
	return (
		<div class="flex flex-col bg-[#0A0A0A] gap-0.5 px-6 py-4 h-32 font-bold rounded-xl border border-transparent hover:border-white transition-all ease-in-out duration-150">
			<p class="text-white text-xl">{classroom.name}</p>
			<div class="flex items-center gap-1">
				<div class="rounded-full size-5 overflow-hidden">
					{classroom.homeroom.avatar_url && (
						<img
							class="size-full"
							src={classroom.homeroom.avatar_url}
						/>
					)}
				</div>
				<p class="text-[#B2B2B2] text-sm">
					@{classroom.homeroom.username}
				</p>
			</div>
		</div>
	);
}
