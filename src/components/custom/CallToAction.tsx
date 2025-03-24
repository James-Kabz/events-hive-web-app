import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-16 bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <h2 className="text-4xl font-bold mb-4">Start Sharing Your Events Now!</h2>
      <p className="mb-8">Reach a wider audience and make your events unforgettable.</p>
      <Button size="lg" variant="ghost">Create Event</Button>
    </section>
  );
}
