import { BookOpen } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col items-center justify-center pt-20">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <BookOpen className="w-10 h-10 text-blue-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Library</h1>
      <p className="text-gray-500 max-w-md text-center">
        Your saved question papers, reading materials, and resources will appear here. This feature is coming soon!
      </p>
    </div>
  );
}
