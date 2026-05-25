import { Wrench } from "lucide-react";

export default function ToolkitPage() {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col items-center justify-center pt-20">
      <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
        <Wrench className="w-10 h-10 text-purple-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Teacher's Toolkit</h1>
      <p className="text-gray-500 max-w-md text-center">
        Explore advanced AI tools for lesson planning, grading, and student analytics. Coming soon!
      </p>
    </div>
  );
}
