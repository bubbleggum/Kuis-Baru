import { fetchJoinedClassrooms } from "./classroom_new.ts";

const encoder = new TextEncoder();

export async function subscribeEvents(userId: bigint) {
	const classrooms = await fetchJoinedClassrooms(userId);
	const classroomChannels = new Map(
		classrooms.map((
			classroom,
		) => [classroom.id, new BroadcastChannel("cl." + classroom.id)]),
	);

	let timerId: number | undefined;

	const stream = new ReadableStream({
		start(controller) {
			let sequences = 0;

			function fireEvent(event: EventData) {
				controller.enqueue(
					encoder.encode(
						"event: " + event.name + "\ndata: " +
							JSON.stringify(event.data) + "\n\n",
					),
				);
			}

			timerId = setInterval(
				() => fireEvent({ name: "ping", data: { seq: sequences++ } }),
				5_000,
			);
		},
		cancel() {
			for (const channel of classroomChannels.values().toArray()) {
				channel.close();
			}

			if (timerId) {
				clearInterval(timerId);
			}
		},
	});

	return new Response(stream, {
		headers: {
			"content-type": "text/event-stream",
		},
	});
}

interface EventData {
	name: string;
	data: unknown;
}
