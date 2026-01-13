import { useState } from "preact/hooks";
import { CreateClassroom } from "../schemas/classroom.ts";
import { APICreateClassroomResult } from "../routes/api/classrooms/index.ts";

export function CreateClassroomIsland() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [creating, setCreating] = useState(false);

	const canCreate = name.length > 1 && !creating;

	async function createClassroomRequest() {
		if (!creating) {
			setCreating(true);

			const response = await fetch("/api/classrooms", {
				method: "POST",
				body: JSON.stringify({ name } satisfies CreateClassroom),
			});

			if (response.ok) {
				const data: APICreateClassroomResult = await response.json();
				globalThis.location.href = "/c/" + data.id;
			} else {
				setCreating(false);
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
					class="lucide lucide-plus-icon lucide-plus"
				>
					<path d="M5 12h14" />
					<path d="M12 5v14" />
				</svg>
			</button>
			{open && (
				<div class="flex justify-center items-center p-5 fixed inset-0 bg-black/50 backdrop-blur-sm">
					<div class="flex flex-col gap-3 px-6 py-5 w-full max-w-96 rounded-xl bg-[#111111]">
						<div class="flex flex-col">
							<p class="text-white">Buat Kelas</p>
							<p class="text-[#9C9C9C] text-xs">
								Buat space baru untuk murid-murid kamu
							</p>
						</div>
						<input
							class="bg-[#1B1B1B] w-full px-3 py-2 text-sm text-white placeholder:text-[#565656] rounded-lg outline-none"
							placeholder="Masukkan Nama Kelas"
							value={name}
							onInput={(input) =>
								setName(input.currentTarget.value)}
						/>
						<div class="flex gap-2 text-sm">
							<button
								class="flex justify-center items-center bg-white grow py-1.5 text-black rounded-xl disabled:opacity-50"
								type="button"
								disabled={!canCreate}
								onClick={() => createClassroomRequest()}
							>
								<p>{!creating ? "Buat" : "Membuat..."}</p>
							</button>
							<button
								class="flex justify-center items-center bg-[#350A0A] grow py-1.5 text-[#DE4F4F] border border-[#BC2F2F] rounded-xl"
								type="button"
								onClick={() => {
									setOpen(false);
									setName("");
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
