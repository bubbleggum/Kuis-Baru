import { useEffect, useState } from "preact/hooks";
import { Member, MemberRole } from "../../../../../schemas/classroom_new.ts";
import { MemberItem } from "../../../../../components/MemberItem.tsx";
import { APISearchMembersResult } from "../../../../api/classrooms/[classroomId]/members/index.ts";

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

	async function copyInvite() {
		if (inviteCode) {
			await navigator.clipboard.writeText(inviteCode);
			setCopied(true);
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
			<div class="flex items-center justify-between bg-[#0A0A0A] gap-4 pt-4">
				<div class="flex items-center grow relative">
					<input
						class="bg-[#1B1B1B] w-full max-w-80 pl-11 pr-3 h-10 text-sm text-white placeholder:text-[#565656] font-bold rounded-lg outline-none"
						placeholder="Cari Anggota..."
						onInput={(input) =>
							setUsername(input.currentTarget.value)}
						onKeyDown={(key) => {
							if (key.code == "Enter") {
								findMembers();
							}
						}}
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
				</div>
				<div class="flex gap-2">
					{inviteCode && (
						<button
							class="flex justify-center items-center min-w-10 md:min-w-auto md:px-3 h-10 bg-white data-[copied=true]:bg-green-500 gap-2 rounded-lg text-black data-[copied=true]:text-white font-bold"
							type="button"
							disabled={copied}
							onClick={copyInvite}
							data-copied={copied}
						>
							{!copied
								? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-copy-icon lucide-copy"
									>
										<rect
											width="14"
											height="14"
											x="8"
											y="8"
											rx="2"
											ry="2"
										/>
										<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
									</svg>
								)
								: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-check-icon lucide-check"
									>
										<path d="M20 6 9 17l-5-5" />
									</svg>
								)}
							<p class="hidden md:flex">
								{!copied ? "Salin Kode" : "Disalin"}
							</p>
						</button>
					)}
				</div>
			</div>
			<div class="flex flex-col pb-4 gap-2 text-white overflow-y-auto size-full relative">
				{homerooms.length > 0 && (
					<>
						<div class="bg-[#0A0A0A] pt-4 font-bold sticky top-0">
							<p>Wali Kelas</p>
						</div>
						{homerooms.map((member) => (
							<MemberItem key={member.user_id} member={member} />
						))}
					</>
				)}
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
		</div>
	);
}
