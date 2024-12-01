import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Link 
        href="/course" 
        className="px-6 py-3 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out text-lg font-semibold"
      >
        Go to my Course Website
      </Link>
    </div>
  );
}