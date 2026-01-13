import { Member } from "../schemas/classroom_new.ts";

export function MemberItem({ member }: { member: Member }) {
	return (
		<div class="flex items-center px-4 py-2 gap-4">
			<div class="bg-white rounded-full size-10 overflow-hidden">
				{member.user.avatar_url && (
					<img class="size-full" src={member.user.avatar_url} />
				)}
			</div>
			<p class="text-white text-lg font-semibold">
				{member.user.username}
			</p>
		</div>
	);
}
