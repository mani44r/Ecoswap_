export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🌱 EcoSwap
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sustainable Shopping Platform
        </p>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Building a Greener Future
          </h2>
          <p className="text-gray-600 leading-relaxed">
            EcoSwap is an AI-powered e-commerce platform that helps you make 
            environmentally conscious purchasing decisions. Our intelligent 
            recommendation system analyzes product sustainability metrics to 
            suggest eco-friendly alternatives.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold">AI Recommendations</h3>
              <p className="text-sm text-gray-500">Smart product suggestions</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold">Carbon Tracking</h3>
              <p className="text-sm text-gray-500">Monitor your footprint</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🎮</div>
              <h3 className="font-semibold">Eco Credits</h3>
              <p className="text-sm text-gray-500">Gamified sustainability</p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          🚧 Currently in development - Building MVP features
        </div>
      </div>
    </main>
  )
}