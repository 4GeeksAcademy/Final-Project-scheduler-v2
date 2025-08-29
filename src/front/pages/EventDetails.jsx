import Timer from "../components/Timer";

export default function EventDetails() {
  const mockEvent = {
    id: 1,
    title: "Study Group Session",
    date: "8/22/25",
    name: "Haley",
    time: "10am",
    timezone: "EST",
    attendees: ["Haley", "Connor", "Rudy"],
    visibility: "public",
    host: "Haley",
    repeat: "weekly",
    description: "Weekly study group for learning Python",
    timer: "00:30:00",
    color: "#3B82F6" // <-- User-chosen color
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-16">
      {/* Event Card */}
      <div
        className="w-full max-w-lg p-6 rounded-lg shadow-md border"
        style={{ backgroundColor: mockEvent.color }}
      >
        {/* Title + Host */}
        <h1 className="text-2xl font-bold mb-1">{mockEvent.title}</h1>
        <p className="text-gray-500 text-sm mb-4">
          👤 Hosted by <strong>{mockEvent.host}</strong>
        </p>

        {/* Event Info */}
        <div className="space-y-3 text-sm">
          <p>📅 <strong>Date:</strong> {mockEvent.date}</p>
          <p>⏰ <strong>Time:</strong> {mockEvent.time} {mockEvent.timezone}</p>
          <p>🌍 <strong>Visibility:</strong> {mockEvent.visibility}</p>
          <p>🔁 <strong>Repeat:</strong> {mockEvent.repeat}</p>

          <div>
            🧑‍🤝‍🧑 <strong>Attendees:</strong>
            <ul className="list-disc list-inside ml-5 text-gray-700">
              {mockEvent.attendees.map((person, i) => (
                <li key={i}>{person}</li>
              ))}
            </ul>
          </div>

          <div>
            📝 <strong>Description:</strong>
            <p className="text-gray-600">{mockEvent.description}</p>
          </div>

          <div>
            ⏳ <strong>Timer:</strong> <Timer initialTime={1800} />
          </div>
        </div>
      </div>
    </div>
  );
}
