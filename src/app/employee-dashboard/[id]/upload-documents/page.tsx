'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const documentFields = [
  { title: "10th Mark Sheet / Certificate", name: "marks10", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "12th Mark Sheet / Certificate", name: "marks12", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "Diploma (if applicable)", name: "diploma", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "All Semester Mark Sheets (Bachelor’s / Master’s)", name: "semMarks", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "Degree Certificate / Provisional Degree Certificate", name: "degreeCert", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "Aadhaar Card", name: "aadhaar", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "PAN Card", name: "pan", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "Passport / Voter ID / Driving License", name: "secondaryId", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "Passport-size Photograph", name: "photo", accept: ".jpg,.jpeg,.png" },
  { title: "Updated Resume (PDF)", name: "resume", accept: ".pdf" },
  { title: "Previous Company Offer Letter(s)", name: "offerLetter", accept: ".pdf" },
  { title: "Relieving Letter(s)", name: "relievingLetter", accept: ".pdf" },
  { title: "Last 3 Months' Salary Slips", name: "salarySlips", accept: ".pdf" },
  { title: "Experience Certificate(s)", name: "experienceCert", accept: ".pdf" },
  { title: "Canceled Cheque / Bank Passbook", name: "bankProof", accept: ".pdf,.jpg,.jpeg,.png" },
];

export default function UploadDocumentsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [uploads, setUploads] = useState<{ [key: string]: string }>({});

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, name: string) {
    const file = e.target.files?.[0];
    setUploads(prev => ({
      ...prev,
      [name]: file ? file.name : '',
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Save/upload logic here
    router.push(`/candidate-dashboard/${params.id}`);
  }

  function handleBack() {
    router.back();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl mb-4 flex justify-between items-center">
        <button
          className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600"
          onClick={handleBack}
        >
          &#8592; Back
        </button>
      </div>
      <div className="bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Upload Required Documents</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {documentFields.map(field => (
            <div key={field.name} className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <label className="text-slate-300 font-medium w-64">{field.title}</label>
              <input
                type="file"
                name={field.name}
                accept={field.accept}
                className="input"
                onChange={e => handleFileChange(e, field.name)}
              />
              {uploads[field.name] && (
                <span className="text-xs text-green-400">{uploads[field.name]}</span>
              )}
            </div>
          ))}
          <button type="submit" className="px-6 py-2 rounded-lg bg-cyan-600 text-white font-semibold w-full">Submit All Documents</button>
        </form>
      </div>
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          background: #1e293b;
          color: #fff;
          border: 1px solid #334155;
          margin-bottom: 0.5rem;
        }
        .input:disabled {
          background: #334155;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
