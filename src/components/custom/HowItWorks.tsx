import { Card } from "@/components/ui/card";

export function HowItWorks() {
  const steps = [
    { step: "1. Sign Up", description: "Create an account in just a few seconds." },
    { step: "2. Create Event", description: "Fill in the event details and make it live." },
    { step: "3. Share & Explore", description: "Share your event or explore others." }
  ];

  return (
    <section className="py-16 bg-white">
      <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {steps.map((item, idx) => (
          <Card key={idx} className="p-6 shadow-lg text-center">
            <h3 className="text-2xl font-semibold mb-4">{item.step}</h3>
            <p className="text-gray-600">{item.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
