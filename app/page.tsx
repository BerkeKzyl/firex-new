import Carousel from "../components/Carousel";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">FireX Carousel</h1>
      <Carousel />
    </main>
  );
}
