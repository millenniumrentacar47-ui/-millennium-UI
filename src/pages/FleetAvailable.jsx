import Listings from "../components/Listings";

export default function FleetAvailable() {
  return (
    <main>
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Fleet</h1>
          <p className="text-lg text-gray-600">
            Explore our wide selection of premium vehicles available for rent
          </p>
        </div>
      </section>
      <Listings />
    </main>
  );
}
