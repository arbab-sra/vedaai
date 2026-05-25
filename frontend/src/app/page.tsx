"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Trash2, Plus, ArrowLeft, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
export default function AssignmentsPage() {
  const { assignments, setAssignments, isLoading, setIsLoading } = useAppStore();

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const fetchAssignments = async (isFirstLoad = false) => {
      if (isFirstLoad) setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/assignments`);
        const data = await res.json();
        if (data.success) {
          setAssignments(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      } finally {
        if (isFirstLoad) setIsLoading(false);
      }
    };

    fetchAssignments(true);

    const hasActiveAssignments = useAppStore.getState().assignments.some(
      a => ['PENDING', 'EXTRACTING_TEXT', 'GENERATING'].includes(a.status)
    );

    // Only poll if there are active assignments being generated
    if (hasActiveAssignments) {
      pollInterval = setInterval(() => {
        fetchAssignments(false);
      }, 3000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [setAssignments, setIsLoading, assignments]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // prevent triggering the Link
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/assignments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAssignments(assignments.filter(a => a._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (assignments.length === 0) {
    return (
      <div className="max-w-4xl mx-auto pb-24 md:pb-0 h-full flex flex-col relative">
        <div className="flex flex-col items-center justify-center flex-1 max-w-md mx-auto text-center mt-12">
          {/* Illustration Container */}
          <div className="w-64 h-64 mb-6 bg-gray-200 rounded-full flex items-center justify-center relative overflow-hidden">
            {/* Abstract shapes matching the screenshot */}
            <div className="absolute top-1/4 left-1/4 w-12 h-12 border-2 border-gray-400 rounded-full opacity-50"></div>
            <div className="absolute top-10 right-10 w-4 h-4 bg-blue-400 rounded-full"></div>
            <div className="absolute bottom-12 right-1/4 w-3 h-3 bg-blue-600 rounded-full transform rotate-45"></div>
            
            {/* Document icon */}
            <div className="w-24 h-32 bg-white rounded-lg shadow-md absolute z-10 flex flex-col items-center pt-4 border-2 border-gray-100">
              <div className="w-12 h-2 bg-gray-800 rounded-full mb-3"></div>
              <div className="w-16 h-2 bg-gray-200 rounded-full mb-2"></div>
              <div className="w-16 h-2 bg-gray-200 rounded-full mb-2"></div>
              <div className="w-16 h-2 bg-gray-200 rounded-full mb-2"></div>
              <div className="w-10 h-2 bg-gray-200 rounded-full mb-2 self-start ml-4"></div>
            </div>
            
            {/* Magnifying glass with X */}
            <div className="absolute z-20 bottom-12 right-12">
               <div className="relative">
                 <div className="w-20 h-20 bg-white/80 backdrop-blur border-4 border-gray-100 rounded-full flex items-center justify-center shadow-lg">
                    <div className="text-4xl text-red-500 font-black">×</div>
                 </div>
                 <div className="w-4 h-12 bg-gray-200 rounded-full absolute -bottom-8 -right-4 transform -rotate-45"></div>
               </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No assignments yet</h2>
          <p className="text-gray-500 mb-8 px-4 text-sm leading-relaxed">
            Create your first assignment to start collecting and grading student submissions. 
            You can set up rubrics, define marking criteria, and let AI assist with grading.
          </p>
          <Link href="/create" className="inline-flex items-center bg-[#1A1A1A] hover:bg-black text-white rounded-full px-8 py-4 text-sm font-semibold shadow-lg transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Assignment
          </Link>
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="md:hidden fixed bottom-28 right-6 z-30">
          <Link href="/create" className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] text-orange-500 hover:bg-gray-50 transition-colors">
            <Plus className="w-6 h-6" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-0 relative min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center mb-6 pt-2">
        <Link
          href="/"
          className="w-10 h-10 bg-[#E5E5E5] rounded-full flex items-center justify-center mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <h1 className="text-[1.35rem] font-bold flex-1 text-center pr-14 text-gray-900">
          Assignments
        </h1>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant="outline"
          className="rounded-full py-6 px-6 bg-white border-none shadow-sm text-gray-500 font-normal"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Name"
            className="w-full pl-12 pr-4 py-3 bg-white border-none shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Link
            prefetch={false}
            key={assignment._id}
            href={`/assignment/${assignment._id}`}
            className="block"
          >
            <div className="bg-[#F8F9FA] p-5 rounded-[24px] border-none shadow-sm hover:shadow-md transition-shadow relative">
              <div className="flex justify-between items-start mb-3 pr-8">
                <h3 className="text-[1.1rem] font-extrabold tracking-tight text-gray-900">
                  {assignment.title}
                </h3>
              </div>
              <button
                className="absolute top-5 right-4 text-gray-800 hover:text-red-500 transition-colors p-1"
                onClick={(e) => handleDelete(assignment._id, e)}
                title="Delete Assignment"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[0.85rem] text-gray-500">
                  <span className="font-bold text-gray-800">
                    Assigned on :{" "}
                    <span className="font-medium text-gray-500">
                      {new Date(assignment.createdAt)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                    </span>
                  </span>
                  <span className="font-bold text-gray-800 ml-2">
                    Due :{" "}
                    <span className="font-medium text-gray-500">
                      {new Date(assignment.dueDate)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                    </span>
                  </span>
                </div>

                {assignment.status !== "COMPLETED" && (
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        assignment.status === "GENERATING" 
                          ? "bg-blue-100 text-blue-700"
                          : assignment.status === "EXTRACTING_TEXT"
                            ? "bg-purple-100 text-purple-700"
                            : assignment.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {assignment.status.replace("_", " ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="md:hidden fixed bottom-28 right-6 z-30">
        <Link
          href="/create"
          className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] text-orange-500 hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </Link>
      </div>
    </div>
  );
}
