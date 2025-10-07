'use client';

import React, { useState } from 'react';
import { CheckCircle, Circle, FileText, Users, Briefcase, Award } from 'lucide-react';

export default function OnboardingPage({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      id: 1,
      title: 'Welcome to Truerize',
      description: 'Complete your onboarding process to get started',
      icon: <Users className="w-8 h-8" />,
      completed: true
    },
    {
      id: 2,
      title: 'Document Submission',
      description: 'Upload required documents for verification',
      icon: <FileText className="w-8 h-8" />,
      completed: true
    },
    {
      id: 3,
      title: 'Profile Setup',
      description: 'Complete your employee profile information',
      icon: <Briefcase className="w-8 h-8" />,
      completed: false
    },
    {
      id: 4,
      title: 'Training & Orientation',
      description: 'Attend mandatory training sessions',
      icon: <Award className="w-8 h-8" />,
      completed: false
    }
  ];

  const tasks = [
    { id: 1, title: 'Complete Personal Information', completed: true, step: 3 },
    { id: 2, title: 'Upload ID Proof', completed: true, step: 2 },
    { id: 3, title: 'Upload Address Proof', completed: true, step: 2 },
    { id: 4, title: 'Upload Educational Certificates', completed: false, step: 2 },
    { id: 5, title: 'Set Up Bank Details', completed: false, step: 3 },
    { id: 6, title: 'Complete IT Setup', completed: false, step: 3 },
    { id: 7, title: 'Attend HR Orientation', completed: false, step: 4 },
    { id: 8, title: 'Complete Safety Training', completed: false, step: 4 }
  ];

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Onboarding Progress</h1>
        <div className="text-right">
          <p className="text-sm text-slate-400">Overall Progress</p>
          <p className="text-2xl font-bold">{Math.round(progressPercentage)}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#1E2A44] rounded-xl p-6 mb-6">
        <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-center text-slate-400">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>

      {/* Onboarding Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {onboardingSteps.map((step, index) => (
          <div
            key={step.id}
            className={`bg-[#1E2A44] rounded-xl p-6 text-center transition-all ${
              step.completed ? 'border-2 border-green-500' : 'border-2 border-slate-600'
            }`}
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              step.completed ? 'bg-green-500/20 text-green-400' : 'bg-slate-600 text-slate-400'
            }`}>
              {step.completed ? <CheckCircle className="w-8 h-8" /> : step.icon}
            </div>
            <h3 className="font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-slate-400">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-[#1E2A44] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Tasks to Complete</h2>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                task.completed ? 'bg-green-500/10 border border-green-500/20' : 'bg-[#15253B]'
              }`}
            >
              <div className="flex items-center space-x-4">
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
                <div>
                  <p className={`font-medium ${task.completed ? 'text-green-400' : 'text-white'}`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-slate-400">Step {task.step}</p>
                </div>
              </div>
              {!task.completed && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  Complete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-[#1E2A44] rounded-xl p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <p className="text-slate-300">Upload your educational certificates to complete document submission</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <p className="text-slate-300">Set up your banking details for salary processing</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <p className="text-slate-300">Attend the scheduled HR orientation session</p>
          </div>
        </div>
      </div>
    </div>
  );
}
