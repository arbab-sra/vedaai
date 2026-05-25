"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Plus, X, ArrowLeft, ArrowRight, CalendarIcon, FileText } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface QuestionTypeConfig {
  id: string;
  type: string;
  count: number;
  marks: number;
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const [difficulty, setDifficulty] = useState('Mixed');
  const [targetAudience, setTargetAudience] = useState('All Learners');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeConfig[]>([
    { id: '1', type: 'Multiple Choice Questions', count: 4, marks: 4 },
    { id: '2', type: 'Short Answer Questions', count: 4, marks: 4 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = questionTypes.reduce((acc, curr) => acc + curr.count, 0);
  const totalMarks = questionTypes.reduce((acc, curr) => acc + curr.marks, 0);

  const addQuestionType = () => {
    setQuestionTypes([
      ...questionTypes,
      { id: Math.random().toString(36).substring(7), type: 'Descriptive Questions', count: 1, marks: 5 }
    ]);
  };

  const updateQuestionType = (id: string, field: keyof QuestionTypeConfig, value: any) => {
    setQuestionTypes(questionTypes.map(qt => qt.id === id ? { ...qt, [field]: value } : qt));
  };

  const removeQuestionType = (id: string) => {
    setQuestionTypes(questionTypes.filter(qt => qt.id !== id));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!dueDate) {
      alert('Please select a due date');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title || 'Untitled Assignment');
      formData.append('dueDate', dueDate.toISOString());
      formData.append('difficulty', difficulty);
      formData.append('targetAudience', targetAudience);
      
      const config = {
        questionTypes: questionTypes.map(({ type, count, marks }) => ({ type, count, marks })),
        totalQuestions,
        totalMarks,
        instructions: instructions || 'Attempt all questions.',
      };
      formData.append('configuration', JSON.stringify(config));
      
      if (file) {
        formData.append('file', file);
      }

      const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\\/+$/, '')}/api/assignments`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/assignment/${data.data._id}`);
      } else {
        alert(data.error || 'Failed to create assignment');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred' , );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-48 px-4 sm:px-6 relative min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center mb-6 pt-2">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-[#E5E5E5] rounded-full flex items-center justify-center mr-4 shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-[1.35rem] font-bold flex-1 text-center pr-14 text-gray-900">
          Create Assignment
        </h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Assignment
          </h1>
        </div>
        <p className="text-gray-500 text-sm ml-6">
          Set up a new assignment for your students
        </p>
      </div>

      <div className="flex gap-2 mb-8 md:ml-6">
        <div className="h-1 bg-gray-900 rounded-full w-1/2"></div>
        <div className="h-1 bg-gray-200 rounded-full w-1/2"></div>
      </div>

      <div className="bg-[#F8F9FA] rounded-[32px] p-6 md:p-10 border border-gray-100 relative">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            Assignment Details
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Basic information about your assignment
          </p>
        </div>

        <div className="space-y-8">
          {/* File Upload Area */}
          <div>
            <div
              className={cn(
                "border-[1.5px] border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-colors bg-white",
                file
                  ? "border-orange-500"
                  : "border-gray-300 hover:border-gray-400",
              )}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.txt"
              />

              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-gray-700" />
                  </div>
                  <p className="text-gray-900 font-medium mb-1">{file.name}</p>
                  <p className="text-gray-500 text-sm mb-4">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white rounded-full px-6 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                    onClick={removeFile}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-gray-700 mb-4" />
                  <p className="text-gray-900 font-medium mb-1 text-sm">
                    Choose a file or drag & drop it here
                  </p>
                  <p className="text-gray-400 text-xs mb-4">
                    JPEG, PNG, upto 10MB
                  </p>
                  <Button
                    variant="outline"
                    className="bg-gray-50 border-none rounded-full px-6 hover:bg-gray-100 text-gray-700 text-sm h-10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </Button>
                </>
              )}
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Upload images of your preferred document/image
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-900">
                Assignment Title
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 bg-white border-gray-200 rounded-xl px-4"
                placeholder="Enter title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-900">
                  Due Date
                </Label>
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full h-12 justify-between font-normal bg-white border-gray-200 rounded-xl px-4",
                      !dueDate && "text-gray-400",
                    )}
                  >
                    {dueDate ? (
                      format(dueDate, "dd-MM-yyyy")
                    ) : (
                      <span>DD-MM-YYYY</span>
                    )}
                    <CalendarIcon className="h-5 w-5 text-gray-600" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-900">
                  Difficulty
                </Label>
                <Select
                  value={difficulty}
                  onValueChange={(val) => setDifficulty(val || "Mixed")}
                >
                  <SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl px-4">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-900">
                  Audience
                </Label>
                <Select
                  value={targetAudience}
                  onValueChange={(val)=>setTargetAudience(val||"All Learners")}
                >
                  <SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-xl px-4">
                    <SelectValue placeholder="Audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Learners">All Learners</SelectItem>
                    <SelectItem value="School Student">School</SelectItem>
                    <SelectItem value="College Student">College</SelectItem>
                    <SelectItem value="Interview Candidate">
                      Interview
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-end mb-4">
              <Label className="text-sm font-bold text-gray-900 w-1/2">
                Question Type
              </Label>
              <div className="flex w-1/2 justify-end gap-12 pr-4 text-sm font-medium text-gray-700">
                <span className="w-32 text-center mr-6">No. of Questions</span>
                <span className="w-24 text-center">Marks</span>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden mb-4">
              <Label className="text-sm font-bold text-gray-900">
                Question Types
              </Label>
            </div>

            <div className="space-y-3">
              {questionTypes.map((qt) => (
                <div
                  key={qt.id}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none"
                >
                  <div className="flex w-full md:flex-1 bg-gray-50 md:bg-white border border-gray-100 rounded-full pr-4 shadow-sm items-center">
                    <Select
                      value={qt.type}
                      onValueChange={(val) =>
                        updateQuestionType(qt.id, "type", val)
                      }
                    >
                      <SelectTrigger className="flex-1 border-none bg-transparent shadow-none px-6 h-12 text-sm font-medium focus:ring-0">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Multiple Choice Questions">
                          Multiple Choice Questions
                        </SelectItem>
                        <SelectItem value="Short Answer Questions">
                          Short Answer Questions
                        </SelectItem>
                        <SelectItem value="Descriptive Questions">
                          Descriptive Questions
                        </SelectItem>
                        <SelectItem value="Diagram/Graph-Based Questions">
                          Diagram/Graph-Based Questions
                        </SelectItem>
                        <SelectItem value="Numerical Problems">
                          Numerical Problems
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col md:hidden">
                        <span className="text-[11px] font-bold text-gray-500 mb-1 ml-2">
                          Questions
                        </span>
                        <div className="flex items-center bg-gray-50 md:bg-white rounded-full h-12 px-2 shadow-sm border border-gray-100 w-24 justify-between">
                          <button
                            onClick={() =>
                              updateQuestionType(
                                qt.id,
                                "count",
                                Math.max(1, qt.count - 1),
                              )
                            }
                            className="text-gray-400 hover:text-gray-900 w-8 h-8 flex items-center justify-center font-bold"
                          >
                            –
                          </button>
                          <span className="font-bold text-sm w-4 text-center">
                            {qt.count}
                          </span>
                          <button
                            onClick={() =>
                              updateQuestionType(qt.id, "count", qt.count + 1)
                            }
                            className="text-gray-400 hover:text-gray-900 w-8 h-8 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col md:hidden">
                        <span className="text-[11px] font-bold text-gray-500 mb-1 ml-2">
                          Marks
                        </span>
                        <div className="flex items-center bg-gray-50 md:bg-white rounded-full h-12 px-2 shadow-sm border border-gray-100 w-24 justify-between">
                          <button
                            onClick={() =>
                              updateQuestionType(
                                qt.id,
                                "marks",
                                Math.max(1, qt.marks - 1),
                              )
                            }
                            className="text-gray-400 hover:text-gray-900 w-8 h-8 flex items-center justify-center font-bold"
                          >
                            –
                          </button>
                          <span className="font-bold text-sm w-4 text-center">
                            {qt.marks}
                          </span>
                          <button
                            onClick={() =>
                              updateQuestionType(qt.id, "marks", qt.marks + 1)
                            }
                            className="text-gray-400 hover:text-gray-900 w-8 h-8 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Desktop steppers */}
                      <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center bg-white rounded-full h-12 px-2 shadow-sm border border-gray-100 w-28 justify-between">
                          <button
                            onClick={() =>
                              updateQuestionType(
                                qt.id,
                                "count",
                                Math.max(1, qt.count - 1),
                              )
                            }
                            className="text-gray-300 hover:text-gray-900 w-8 h-8 flex items-center justify-center font-bold"
                          >
                            –
                          </button>
                          <span className="font-bold text-sm w-4 text-center">
                            {qt.count}
                          </span>
                          <button
                            onClick={() =>
                              updateQuestionType(qt.id, "count", qt.count + 1)
                            }
                            className="text-gray-300 hover:text-gray-900 w-8 h-8 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center bg-white rounded-full h-12 px-2 shadow-sm border border-gray-100 w-28 justify-between">
                          <button
                            onClick={() =>
                              updateQuestionType(
                                qt.id,
                                "marks",
                                Math.max(1, qt.marks - 1),
                              )
                            }
                            className="text-gray-300 hover:text-gray-900 w-8 h-8 flex items-center justify-center font-bold"
                          >
                            –
                          </button>
                          <span className="font-bold text-sm w-4 text-center">
                            {qt.marks}
                          </span>
                          <button
                            onClick={() =>
                              updateQuestionType(qt.id, "marks", qt.marks + 1)
                            }
                            className="text-gray-300 hover:text-gray-900 w-8 h-8 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeQuestionType(qt.id)}
                      className="text-gray-400 hover:text-red-500 p-2 md:px-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addQuestionType}
              className="flex items-center text-gray-900 font-bold text-sm mt-6 hover:underline"
            >
              <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white mr-2 shadow-md">
                <Plus className="w-4 h-4" />
              </div>
              Add Question Type
            </button>
          </div>

          <div className="flex flex-col items-end text-sm pt-4">
            <div className="flex justify-between w-48 mb-2">
              <span className="text-gray-700">Total Questions :</span>
              <span className="font-bold text-gray-900">{totalQuestions}</span>
            </div>
            <div className="flex justify-between w-48">
              <span className="text-gray-700">Total Marks :</span>
              <span className="font-bold text-gray-900">{totalMarks}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-sm font-bold text-gray-900">
              Additional Information (For better output)
            </Label>
            <div className="relative">
              <textarea
                className="w-full bg-[#F2F2F2] border-none rounded-2xl p-4 min-h-[120px] text-sm resize-none focus:ring-1 focus:ring-gray-300"
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              ></textarea>
              <div className="absolute bottom-4 right-4 text-gray-400 bg-white rounded-full p-2 shadow-sm hover:text-gray-700 cursor-pointer">
                <svg
                  width="14"
                  height="18"
                  viewBox="0 0 14 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 11C8.65685 11 10 9.65685 10 8V3C10 1.34315 8.65685 0 7 0C5.34315 0 4 1.34315 4 3V8C4 9.65685 5.34315 11 7 11Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.9167 8C12.9167 11.2677 10.2677 13.9167 7 13.9167C3.73233 13.9167 1.08333 11.2677 1.08333 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 14V17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center mt-6 px-2">
        <button
          className="flex items-center text-gray-700 font-medium hover:text-gray-900 px-4 py-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        <Button
          className="rounded-full bg-[#1A1A1A] hover:bg-black text-white font-medium px-8 h-12 text-sm"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Next"}
          {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>

      {/* Floating Action Bar for Mobile */}
      <div className="md:hidden fixed bottom-[6.5rem] left-1/2 -translate-x-1/2 flex justify-center gap-4 w-[90%] max-w-[400px] z-40">
        <button
          className="flex-1 flex items-center justify-center bg-white rounded-full px-6 py-3.5 font-medium text-gray-800 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] border border-gray-100"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        <Button
          className="flex-1 rounded-full bg-[#1A1A1A] hover:bg-black text-white font-medium px-8 py-6 h-auto shadow-[0_4px_20px_0_rgba(0,0,0,0.1)]"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Wait..." : "Next"}
          {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
