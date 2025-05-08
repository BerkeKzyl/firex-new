import Carousel from "../components/Carousel";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-br from-orange-50 to-orange-100">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">FireX Carousel</h1>
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
        <Carousel />
      </div>
    </main>
  );
}
