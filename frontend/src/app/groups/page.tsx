import { Users } from "lucide-react";

export default function GroupsPage() {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col items-center justify-center pt-20">
      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
        <Users className="w-10 h-10 text-orange-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Groups</h1>
      <p className="text-gray-500 max-w-md text-center">
        Manage your classes, student groups, and organization units here. Coming soon!
      </p>
    </div>
  );
}
