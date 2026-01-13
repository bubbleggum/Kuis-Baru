import { Member } from "../schemas/classroom_new.ts";

export function MemberItem({ member }: { member: Member }) {
	return (
		<div class="flex items-center bg-black px-4 py-3 gap-4 rounded-lg">
			<div class="rounded-full size-8 overflow-hidden">
				{member.user.avatar_url
					? <img class="size-full" src={member.user.avatar_url} />
					: <div class="bg-white size-full"></div>}
			</div>
			<p class="text-white text-lg font-bold">
				{member.user.username}
			</p>
		</div>
	);
}
