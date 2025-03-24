import { Card } from "@/components/ui/card";

export function EventHighlights() {
  const events = [
    { title: "Music Fest", description: "Join the biggest music festival in the city!" },
    { title: "Startup Meetup", description: "Network with industry leaders and innovators." },
    { title: "Art Exhibition", description: "Explore creative works by local artists." }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-10">Event Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {events.map((event, idx) => (
          <Card key={idx} className="p-6 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">{event.title}</h3>
            <p className="text-gray-700">{event.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
