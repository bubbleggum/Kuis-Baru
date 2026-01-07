import { useState } from "preact/hooks";
import { JoinClassroom } from "../schemas/classroom_new.ts";
import { APIJoinClassroomResult } from "../routes/api/join.ts";

export function JoinClassroomIsland() {
	const [open, setOpen] = useState(false);
	const [code, setCode] = useState("");
	const [joining, setJoining] = useState(false);

	const canJoin = code.length > 1 && !joining;

	async function createClassroomRequest() {
		if (!joining) {
			setJoining(true);

			const response = await fetch("/api/join", {
				method: "POST",
				body: JSON.stringify({ code } satisfies JoinClassroom),
			});

			if (response.ok) {
				const data: APIJoinClassroomResult = await response.json();
				globalThis.location.href = "/classrooms/" + data.classroom_id;
			} else {
				setJoining(false);
			}
		}
	}

	return (
		<>
			<button
				class="flex justify-center items-center bg-[#D5D5D5] size-10 rounded-lg"
				type="button"
				onClick={() => setOpen(true)}
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
			{open && (
				<div class="flex justify-center items-center p-5 fixed inset-0 bg-black/50 backdrop-blur-sm">
					<div class="flex flex-col gap-3 px-6 py-5 w-full max-w-96 rounded-xl bg-[#111111]">
						<div class="flex flex-col">
							<p class="text-white">Gabung Kelas</p>
							<p class="text-[#9C9C9C] text-xs">
								Masukkan kode yang diberikan oleh gurumu
							</p>
						</div>
						<input
							class="bg-[#1B1B1B] w-full px-3 py-2 text-sm text-white placeholder:text-[#565656] rounded-lg outline-none"
							placeholder="Masukkan Kode"
							value={code}
							onInput={(input) =>
								setCode(input.currentTarget.value)}
						/>
						<div class="flex gap-2 text-sm">
							<button
								class="flex justify-center items-center bg-white grow py-1.5 text-black rounded-xl disabled:opacity-50"
								type="button"
								disabled={!canJoin}
								onClick={() => createClassroomRequest()}
							>
								<p>{!joining ? "Gabung" : "Bergabung..."}</p>
							</button>
							<button
								class="flex justify-center items-center bg-[#350A0A] grow py-1.5 text-[#DE4F4F] border border-[#BC2F2F] rounded-xl"
								type="button"
								onClick={() => {
									setOpen(false);
									setCode("");
								}}
							>
								<p>Batal</p>
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
