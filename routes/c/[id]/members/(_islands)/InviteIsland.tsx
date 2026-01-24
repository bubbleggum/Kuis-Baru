import { useState } from "preact/hooks";
import { APIInviteResponse } from "../../../../api/classrooms/[classroomId]/invite.ts";

export function InviteIsland(
	{ classroomId, inviteCode }: {
		classroomId: bigint;
		inviteCode: string | null;
	},
) {
	const [open, setOpen] = useState(false);
	const [code, setCode] = useState(inviteCode ?? "");
	const [generating, setGenerating] = useState(false);

	const canReset = !generating && code.length > 0;

	async function resetInvite() {
		setGenerating(true);
		const response = await fetch(
			`/api/classrooms/` + classroomId + "/invite",
			{
				method: "PUT",
			},
		);

		if (response.ok) {
			const data: APIInviteResponse = await response.json();
			setCode(data.invite_code);
		}
		setGenerating(false);
	}

	return (
		<>
			<button
				class="flex justify-center items-center min-w-10 md:min-w-auto md:px-3 h-10 bg-white text-black font-semibold rounded-md relative"
				type="button"
				onClick={() => setOpen(true)}
			>
				<p>Undang</p>
			</button>
			{open && (
				<div class="flex justify-center items-center p-5 fixed inset-0 bg-black/50 font-semibold backdrop-blur-sm">
					<div class="flex flex-col gap-3 px-6 py-5 w-full max-w-96 rounded-xl bg-[#111111]">
						<div class="flex flex-col">
							<p class="text-white">Undang Guru dan Murid</p>
							<p class="text-[#9C9C9C] text-xs">
								Undang murid dan guru ke dalam kelas kamu (Tekan
								lama kode untuk salin.)
							</p>
						</div>
						<div class="flex justify-center items-center bg-[#1B1B1B] w-full px-3 py-2 text-sm text-white font-mono select-all placeholder:text-[#565656] rounded-lg outline-none">
							<p>{code}</p>
						</div>
						<div class="flex gap-2 text-sm">
							<button
								class="flex justify-center items-center bg-white grow py-1.5 text-black rounded-xl disabled:opacity-50"
								type="button"
								disabled={!canReset}
								onClick={() => resetInvite()}
							>
								<p>{!generating ? "Reset" : "Mereset..."}</p>
							</button>
							<button
								class="flex justify-center items-center bg-[#350A0A] grow py-1.5 text-[#DE4F4F] border border-[#BC2F2F] rounded-xl"
								type="button"
								onClick={() => {
									setOpen(false);
								}}
							>
								<p>Tutup</p>
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
