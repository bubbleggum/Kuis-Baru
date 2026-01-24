import { useEffect, useState } from "preact/hooks";
import { Member, MemberRole } from "../../../../../schemas/classroom_new.ts";
import { MemberItem } from "../../../../../components/MemberItem.tsx";
import { APISearchMembersResult } from "../../../../api/classrooms/[classroomId]/members/index.ts";
import { InviteIsland } from "./InviteIsland.tsx";

export function MembersList(
	{ classroomId, initialMembers, inviteCode }: {
		classroomId: bigint;
		initialMembers: Member[];
		inviteCode: string | null;
	},
) {
	const [members, setMembers] = useState(initialMembers);
	const [fetching, setFetching] = useState(false);
	const [username, setUsername] = useState("");
	const [copied, setCopied] = useState(false);

	const homerooms = members.filter((member) =>
		member.role == MemberRole.Homeroom
	);
	const teachers = members.filter((member) =>
		member.role == MemberRole.Teacher
	);
	const students = members.filter((member) =>
		member.role == MemberRole.Student
	);

	async function findMembers() {
		if (!fetching) {
			setFetching(true);
			const searchParams = new URLSearchParams({
				username,
			});

			const response = await fetch(
				"/api/classrooms/" + classroomId + "/members?" +
					searchParams.toString(),
			);
			if (response.ok) {
				const fetchedMembers: APISearchMembersResult = await response
					.json();
				setMembers(fetchedMembers);
			}
			setFetching(false);
		}
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (copied) {
				setCopied(false);
			}
		}, 3_000);
		return () => clearTimeout(timeout);
	}, [copied]);

	return (
		<div class="flex flex-col px-6 grow">
			<div class="flex flex-col pb-6 gap-2 text-white overflow-y-auto size-full order-last">
				{homerooms.length > 0 && (
					<>
						<div class="bg-[#0A0A0A] pt-4 font-bold">
							<p>Wali Kelas</p>
						</div>
						{homerooms.map((member) => (
							<MemberItem key={member.user_id} member={member} />
						))}
					</>
				)}
				{teachers.length > 0 && (
					<>
						<div class="bg-[#0A0A0A] pt-4 font-bold">
							<p>Guru - {teachers.length}</p>
						</div>
						{teachers.map((member) => (
							<MemberItem key={member.user_id} member={member} />
						))}
					</>
				)}
				{students.length > 0 && (
					<>
						<div class="bg-[#0A0A0A] pt-4 font-bold">
							<p>Murid - {students.length}</p>
						</div>
						{students.map((member) => (
							<MemberItem key={member.user_id} member={member} />
						))}
					</>
				)}
			</div>
			<div class="flex items-center justify-between bg-[#0A0A0A] gap-4 pt-6 relative order-first">
				<form
					class="flex items-center grow relative"
					onSubmit={(event) => {
						event.preventDefault();
						findMembers();
					}}
				>
					<input
						class="bg-[#1B1B1B] w-full max-w-80 pl-11 pr-3 h-10 text-sm text-white placeholder:text-[#565656] font-bold rounded-lg outline-none"
						placeholder="Cari Anggota..."
						onInput={(input) =>
							setUsername(input.currentTarget.value)}
						value={username}
					/>
					{!fetching
						? (
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
						)
						: (
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
								class="lucide lucide-loader-circle-icon lucide-loader-circle animate-spin absolute left-3"
							>
								<path d="M21 12a9 9 0 1 1-6.219-8.56" />
							</svg>
						)}
				</form>
				<div class="flex gap-2">
					<InviteIsland
						classroomId={classroomId}
						inviteCode={inviteCode}
					/>
				</div>
			</div>
		</div>
	);
}
