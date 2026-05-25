"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

export default function AssignmentResultPage() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const fetchAssignment = async () => {
      try {
        const data = await api.getAssignmentById(id as string);
        if (data.success) {
          setAssignment(data.data);
          
          // Stop polling if completed or failed
          if (data.data.status === 'COMPLETED' || data.data.status === 'FAILED') {
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error('Failed to fetch assignment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();

    // Start polling every 3 seconds
    pollInterval = setInterval(() => {
      fetchAssignment();
    }, 3000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [id]);

  const downloadPDF = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  if (!assignment) {
    return <div className="flex items-center justify-center h-full text-gray-500">Assignment not found</div>;
  }

  if (assignment.status === 'PENDING') {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center mt-20">
        <Loader2 className="w-16 h-16 animate-spin text-orange-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request in Queue...</h2>
        <p className="text-gray-500">
          Your request is waiting for an available AI worker. It will start generating shortly.
        </p>
      </div>
    );
  }

  if (assignment.status === 'EXTRACTING_TEXT') {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center mt-20">
        <Loader2 className="w-16 h-16 animate-spin text-purple-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Document...</h2>
        <p className="text-gray-500">
          We are currently reading and extracting text from your uploaded file.
        </p>
      </div>
    );
  }

  if (assignment.status === 'GENERATING') {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center mt-20">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Question Paper...</h2>
        <p className="text-gray-500">
          Our AI is currently crafting the questions based on your specifications. This usually takes about 10-30 seconds.
        </p>
      </div>
    );
  }

  if (assignment.status === 'FAILED') {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center mt-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generation Failed</h2>
        <p className="text-gray-500 mb-6">
          Something went wrong while generating the question paper. Please try again or create a new assignment.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const paper = assignment.generatedPaper;

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'moderate': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'hard':
      case 'challenging': return 'bg-red-100 text-red-700 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 px-2 sm:px-6 relative min-h-screen pt-4 print:max-w-none print:w-full print:p-0 print:m-0 print:min-h-0 print:block">
      {/* Dark Header Card */}
      <div className="bg-[#333333] text-white p-6 rounded-[32px] flex flex-col relative z-0 pb-16 shadow-lg print:hidden">
        <h2 className="text-[15px] leading-relaxed font-medium mb-4 pr-4">
          Certainly! Here is your customized Question Paper for {assignment.targetAudience === 'All Learners' ? 'your students' : assignment.targetAudience} on {assignment.title}:
        </h2>
        
        <button onClick={downloadPDF} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10 text-white self-start">
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* White Paper Card (Overlaps the dark header) */}
      <div className="bg-[#F8F9FA] rounded-[32px] p-6 md:p-12 shadow-xl border border-gray-100 -mt-8 relative z-10 mx-1 print:bg-white print:p-0 print:m-0 print:border-none print:shadow-none print:rounded-none print:block">
        <div ref={paperRef} className="print-container bg-[#F8F9FA] p-2 print:bg-white print:p-0 print:block">
          <div className="text-center mb-8 pb-6">
            <h1 className="text-[1.1rem] font-bold text-gray-900 mb-4 px-8 leading-tight">
              {paper?.institutionName || 'VedaAI Learning'}
            </h1>
            <p className="text-[15px] text-gray-900 font-medium">Subject: {paper?.topic || assignment.title}</p>
            <p className="text-[15px] text-gray-900 font-medium">Audience: {paper?.targetAudience || assignment.targetAudience}</p>
            
            <div className="flex flex-col mt-6 text-[13px] font-medium text-gray-800 gap-2 text-left">
              <span>Time Allowed: {paper?.timeAllowed || '45 minutes'}</span>
              <span>Maximum Marks: {paper?.maximumMarks || assignment.configuration.totalMarks || 20}</span>
            </div>
          </div>

          <div className="mb-6 text-[13px] font-medium text-gray-800">
            All questions are compulsory unless stated otherwise.
          </div>

          <div className="space-y-2 mb-8 pb-4 text-[13px] font-bold text-gray-900">
            <div className="flex gap-2"><span className="w-24">Name:</span> <span className="flex-1 border-b border-gray-500"></span></div>
            <div className="flex gap-2"><span className="w-24">Roll Number:</span> <span className="flex-1 border-b border-gray-500"></span></div>
            <div className="flex gap-2 whitespace-nowrap"><span className="w-auto">{assignment.targetAudience === 'All Learners' ? 'Group' : 'Class/Section'}:</span> <span className="flex-1 border-b border-gray-500"></span></div>
          </div>

          <div className="space-y-12">
            {paper?.sections?.map((section: any, idx: number) => (
              <div key={idx}>
                <h3 className="text-xl font-bold text-center mb-4">{section.title}</h3>
                <p className="text-sm italic text-gray-600 mb-6">{section.instruction}</p>
                
                <div className="space-y-6">
                  {section.questions.map((q: any, qIdx: number) => (
                    <div key={qIdx} className="flex gap-4">
                      <span className="font-medium">{qIdx + 1}.</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className={`text-[10px] uppercase px-1.5 py-0 ${getDifficultyColor(q.difficulty)}`}>
                            {q.difficulty}
                          </Badge>
                          <span className="text-sm font-medium text-gray-500">[{q.marks} Marks]</span>
                        </div>
                        <p className="text-gray-900 leading-relaxed mb-2">{q.questionText}</p>
                        
                        {/* Display Options if it's an MCQ */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 ml-2">
                            {q.options.map((opt: string, optIdx: number) => (
                              <div key={optIdx} className="flex items-start gap-2">
                                <span className="font-semibold text-gray-700">{String.fromCharCode(65 + optIdx)}.</span>
                                <span className="text-gray-800">{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {paper?.answerKey && paper.answerKey.length > 0 && (
            <div className="mt-16 pt-8 border-t-2 border-gray-200 print:break-before-page">
              <h3 className="text-xl font-bold mb-6">Answer Key:</h3>
              <div className="space-y-4 text-gray-700">
                {paper.answerKey.map((ans: string, idx: number) => (
                  <p key={idx} className="leading-relaxed">{ans}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
