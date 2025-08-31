import { FaBeer } from 'react-icons/fa'

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="mb-4 text-3xl font-bold">Vite + React + Tailwind</h1>
      <p className="flex items-center gap-2 text-lg">
        Enjoy a cold one <FaBeer />
      </p>
    </div>
  )
}

export default App
