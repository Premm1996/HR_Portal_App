'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const LOCAL_STORAGE_KEY = 'employeeRegistrationProcessData';

export default function RegistrationPage() {
  const router = useRouter();

  useEffect(() => {
    // Access control: Check authentication and onboarding status
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const candidateId = localStorage.getItem('candidateId');

    if (!token || !userId || !candidateId) {
      router.push('/signin');
      return;
    }

    // Check onboarding status and redirect if prerequisites not met
    const onboardingStatus = localStorage.getItem('onboardingStatus');
    const onboardingStep = localStorage.getItem('onboardingStep');

    // If onboarding is completed, redirect to individual employee dashboard
    if (onboardingStatus === 'completed') {
      router.push(`/employee-dashboard/${userId}`);
      return;
    }

    // If onboarding is not started or in progress, allow access to onboarding form
    if (!onboardingStatus || onboardingStatus === 'not_started' || onboardingStatus === 'onboarding_incomplete') {
      // Allow access to onboarding form page
      return;
    }

    // Load saved form data from localStorage if available
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setForm(parsedData);
      } catch {
        // Ignore parse errors
      }
    }
  }, [router]);

  const [form, setForm] = useState({
    // Personal Information
    fullName: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    mobileNumber: '',
    personalEmail: '',
    currentAddress: '',
    permanentAddress: '',
    passportPhoto: null,

    // Government Identification
    panNumber: '',
    aadhaarNumber: '',
    passport: '',
    drivingLicence: '',

    // Banking & Payroll
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    branchLocation: '',

    // Employment Details
    jobTitle: '',
    department: '',
    employeeId: '',
    dateOfJoining: '',
    workLocation: '',

    // Education & Qualifications
    education: [
      {
        degree: '',
        institution: '',
        boardUniversity: '',
        yearOfCompletion: '',
        gradePercentage: '',
        certificate: null,
      },
    ],

    // Previous Employment
    previousEmployment: [
      {
        companyName: '',
        jobTitle: '',
        periodFrom: '',
        periodTo: '',
        keyResponsibilities: '',
        reasonForLeaving: '',
        relievingLetter: null,
      },
    ],

    // Career Documents & Links
    resume: null,
    linkedInProfile: '',
    portfolioGitHub: '',

    // Declarations & Acknowledgements
    declarations: {
      confirmInfo: false,
      authorizeVerify: false,
      allowProcessing: false,
      acknowledgePolicies: false,
    },
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  // Save form data to localStorage on change
  useEffect(() => {
    // We cannot store File objects in localStorage, so omit files
    const formCopy = { ...form };
    if (formCopy.passportPhoto) formCopy.passportPhoto = null;
    if (formCopy.resume) formCopy.resume = null;
    formCopy.education = formCopy.education.map(({ certificate, ...rest }) => ({ certificate: null, ...rest }));
    formCopy.previousEmployment = formCopy.previousEmployment.map(({ relievingLetter, ...rest }) => ({ relievingLetter: null, ...rest }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formCopy));
  }, [form]);

  // Handlers for input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handlers for education and previous employment dynamic fields
  const handleEducationChange = (index, e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => {
      const newEducation = [...prev.education];
      if (type === 'file') {
        newEducation[index][name] = files[0];
      } else {
        newEducation[index][name] = value;
      }
      return { ...prev, education: newEducation };
    });
  };

  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: '',
          institution: '',
          boardUniversity: '',
          yearOfCompletion: '',
          gradePercentage: '',
          certificate: null,
        },
      ],
    }));
  };

  const handlePreviousEmploymentChange = (index, e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => {
      const newEmployment = [...prev.previousEmployment];
      if (type === 'file') {
        newEmployment[index][name] = files[0];
      } else {
        newEmployment[index][name] = value;
      }
      return { ...prev, previousEmployment: newEmployment };
    });
  };

  const addPreviousEmployment = () => {
    setForm((prev) => ({
      ...prev,
      previousEmployment: [
        ...prev.previousEmployment,
        {
          companyName: '',
          jobTitle: '',
          periodFrom: '',
          periodTo: '',
          keyResponsibilities: '',
          reasonForLeaving: '',
          relievingLetter: null,
        },
      ],
    }));
  };

  const handleDeclarationChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      declarations: {
        ...prev.declarations,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allConfirmed = Object.values(form.declarations).every(Boolean);
    if (!allConfirmed) {
      alert('Please confirm all declarations.');
      return;
    }

    // Check if userId exists
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Session expired. Please sign in again.');
      // Clear any remaining auth data
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('candidateId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('onboardingStep');
      localStorage.removeItem('hasProfile');
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      router.push('/signin');
      return;
    }

    // Prepare form data for submission including files
    const formData = new FormData();

    // Append simple fields
    [
      'fullName',
      'dob',
      'gender',
      'bloodGroup',
      'mobileNumber',
      'personalEmail',
      'currentAddress',
      'permanentAddress',
      'panNumber',
      'aadhaarNumber',
      'passport',
      'drivingLicence',
      'bankName',
      'accountHolderName',
      'accountNumber',
      'ifscCode',
      'branchLocation',
      'jobTitle',
      'department',
      'employeeId',
      'dateOfJoining',
      'workLocation',
      'linkedInProfile',
      'portfolioGitHub',
    ].forEach((field) => {
      formData.append(field, form[field] || '');
    });

    // Append passport photo
    if (form.passportPhoto) {
      formData.append('passportPhoto', form.passportPhoto);
    }

    // Append resume
    if (form.resume) {
      formData.append('resume', form.resume);
    }

    // Append education array as JSON string and files separately
    formData.append('education', JSON.stringify(form.education.map(({ certificate, ...rest }) => rest)));
    form.education.forEach((edu, idx) => {
      if (edu.certificate) {
        formData.append('educationCertificates', edu.certificate);
      }
    });

    // Append previous employment array as JSON string and files separately
    formData.append('previousEmployment', JSON.stringify(form.previousEmployment.map(({ relievingLetter, ...rest }) => rest)));
    form.previousEmployment.forEach((emp, idx) => {
      if (emp.relievingLetter) {
        formData.append('relievingLetters', emp.relievingLetter);
      }
    });

    formData.append('declarationsConfirmed', allConfirmed.toString());
    formData.append('declarations', JSON.stringify(form.declarations));

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Session expired. Please sign in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('candidateId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('onboardingStep');
        localStorage.removeItem('hasProfile');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        router.push('/signin');
        return;
      }

      const response = await fetch('/api/onboarding/onboarding-form', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        // Clear saved form data on successful submission
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        // Redirect to backend provided redirect URL or fallback to /offer-letter
        router.push(responseData.redirect || '/offer-letter');
      } else if (response.status === 401) {
        // Clear all auth data on session expiration
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('candidateId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('onboardingStep');
        localStorage.removeItem('hasProfile');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        alert('Your session has expired. Please sign in again.');
        // Redirect to signin page on 401 to re-authenticate
        router.push('/signin');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-cyan-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Progress Header */}
        <div className="bg-white/98 backdrop-blur-sm rounded-3xl shadow-2xl p-4 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.img
                src="/logo.jpg"
                alt="Truerize Logo"
                className="h-12 w-12 rounded-xl shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Truerize Employee Registration
                </h1>
                <p className="text-gray-600 text-sm">Complete your registration to join Truerize</p>
              </div>
            </div>
            {/* Removed Step 4 of 4 and Review & Submit text as per user request */}
            {/* Reduced size of navbar */}
            <div className="hidden md:block">
              <div className="text-right text-sm">
                {/* Removed the two <p> elements */}
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <span className="ml-2 text-sm font-medium text-gray-900">Personal Info</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <span className="ml-2 text-sm font-medium text-gray-900">Documents</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <span className="ml-2 text-sm font-medium text-gray-900">Employment</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <span className="ml-2 text-sm font-medium text-gray-600">Review</span>
            </div>
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/98 backdrop-blur-sm rounded-3xl shadow-2xl p-10 overflow-auto border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

        {/* 1. Personal Information */}
        <section className="mb-10">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">1</div>
            <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
          </div>
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name (as per government ID)"
              value={form.fullName}
              onChange={handleChange}
              className="input-field"
            />
            <div>
              <label className="block mb-1 font-semibold text-cyan-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <input
              type="tel"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={form.mobileNumber}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="email"
              name="personalEmail"
              placeholder="Personal Email"
              value={form.personalEmail}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="currentAddress"
              placeholder="Current Address"
              value={form.currentAddress}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="permanentAddress"
              placeholder="Permanent Address"
              value={form.permanentAddress}
              onChange={handleChange}
              className="input-field"
            />
            <div>
              <label className="block mb-1 font-semibold text-cyan-700">Passport-size Photograph</label>
              <input
                type="file"
                name="passportPhoto"
                accept="image/*"
                onChange={handleChange}
                className="file-input"
              />
            </div>
            </div>
          </div>
        </section>

        {/* 2. Government Identification */}
        <section className="mb-8 bg-cyan-50 p-6 rounded-2xl border border-cyan-200">
          <h3 className="text-lg font-semibold mb-4 border-b border-cyan-300 pb-2 text-gray-900">2. Government Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="panNumber"
              placeholder="PAN Number"
              value={form.panNumber}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="aadhaarNumber"
              placeholder="Aadhaar Number (last 4 digits visible)"
              value={form.aadhaarNumber}
              onChange={handleChange}
              className="input-field"
              maxLength={12}
            />
            <input
              type="text"
              name="passport"
              placeholder="Passport (if applicable)"
              value={form.passport}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="drivingLicence"
              placeholder="Driving Licence (if applicable)"
              value={form.drivingLicence}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <p className="mt-2 text-sm text-blue-700 font-semibold">🔒 Store any ID copies securely (encrypted HR folder or HRMS).</p>
        </section>

        {/* 3. Banking & Payroll */}
        <section className="mb-8 bg-cyan-50 p-6 rounded-2xl border border-cyan-200">
          <h3 className="text-lg font-semibold mb-4 border-b border-cyan-300 pb-2 text-gray-900">3. Banking & Payroll</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="bankName"
              placeholder="Bank Name"
              value={form.bankName}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="accountHolderName"
              placeholder="Account Holder Name"
              value={form.accountHolderName}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="accountNumber"
              placeholder="Account Number"
              value={form.accountNumber}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="ifscCode"
              placeholder="IFSC Code"
              value={form.ifscCode}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="branchLocation"
              placeholder="Branch Location"
              value={form.branchLocation}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </section>

        {/* 4. Employment Details */}
        <section className="mb-8 bg-cyan-50 p-6 rounded-2xl border border-cyan-200">
          <h3 className="text-lg font-semibold mb-4 border-b border-cyan-300 pb-2 text-gray-900">4. Employment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="jobTitle"
              placeholder="Job Title / Role"
              value={form.jobTitle}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="employeeId"
              placeholder="Employee ID (assigned by HR)"
              value={form.employeeId}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="date"
              name="dateOfJoining"
              placeholder="Date of Joining"
              value={form.dateOfJoining}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="workLocation"
              placeholder="Work Location"
              value={form.workLocation}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </section>

        {/* 5. Education & Qualifications */}
        <section className="mb-8 bg-cyan-50 p-6 rounded-2xl border border-cyan-200">
          <h3 className="text-lg font-semibold mb-4 border-b border-cyan-300 pb-2 text-gray-900">5. Education & Qualifications</h3>
          {form.education.map((edu, idx) => (
            <div key={idx} className="mb-4 border p-4 rounded-lg bg-cyan-50">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  name="degree"
                  placeholder="Degree / Program"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(idx, e)}
                  className="input-field"
                />
                <input
                  type="text"
                  name="institution"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(idx, e)}
                  className="input-field"
                />
                <input
                  type="text"
                  name="boardUniversity"
                  placeholder="Board / University"
                  value={edu.boardUniversity}
                  onChange={(e) => handleEducationChange(idx, e)}
                  className="input-field"
                />
                <input
                  type="text"
                  name="yearOfCompletion"
                  placeholder="Year of Completion"
                  value={edu.yearOfCompletion}
                  onChange={(e) => handleEducationChange(idx, e)}
                  className="input-field"
                />
                <input
                  type="text"
                  name="gradePercentage"
                  placeholder="Grade / Percentage"
                  value={edu.gradePercentage}
                  onChange={(e) => handleEducationChange(idx, e)}
                  className="input-field"
                />
              </div>
              <div className="mt-2">
                <label className="block mb-1 font-semibold text-cyan-700">Attach copies of mark sheets / certificates if required</label>
                <input
                  type="file"
                  name="certificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleEducationChange(idx, e)}
                  className="file-input"
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={addEducation} className="btn-add">
            + Add Education
          </button>
        </section>

        {/* 6. Previous Employment */}
        <section className="mb-8 bg-cyan-50 p-6 rounded-2xl border border-cyan-200">
          <h3 className="text-lg font-semibold mb-4 border-b border-cyan-300 pb-2 text-gray-900">6. Previous Employment (if any)</h3>
          {form.previousEmployment.map((emp, idx) => (
            <div key={idx} className="mb-4 border p-4 rounded-lg bg-cyan-50">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={emp.companyName}
                  onChange={(e) => handlePreviousEmploymentChange(idx, e)}
                  className="input-field"
                />
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Job Title"
                  value={emp.jobTitle}
                  onChange={(e) => handlePreviousEmploymentChange(idx, e)}
                  className="input-field"
                />
                <input
                  type="text"
                  name="periodFrom"
                  placeholder="Period (From)"
                  value={emp.periodFrom}
                  onChange={(e) => handlePreviousEmploymentChange(idx, e)}
                  className="input-field"
                />
                <input
                  type="text"
                  name="periodTo"
                  placeholder="Period (To)"
                  value={emp.periodTo}
                  onChange={(e) => handlePreviousEmploymentChange(idx, e)}
                  className="input-field"
                />
                <input
                  type="text"
                  name="keyResponsibilities"
                  placeholder="Key Responsibilities"
                  value={emp.keyResponsibilities}
                  onChange={(e) => handlePreviousEmploymentChange(idx, e)}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <input
                  type="text"
                  name="reasonForLeaving"
                  placeholder="Reason for Leaving"
                  value={emp.reasonForLeaving}
                  onChange={(e) => handlePreviousEmploymentChange(idx, e)}
                  className="input-field"
                />
                <div>
                  <label className="block mb-1 font-semibold text-cyan-700">Attach relieving letter / experience certificate where applicable</label>
                  <input
                    type="file"
                    name="relievingLetter"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handlePreviousEmploymentChange(idx, e)}
                    className="file-input"
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addPreviousEmployment} className="btn-add">
            + Add Previous Employment
          </button>
        </section>

        {/* 7. Career Documents & Links */}
        <section className="mb-8 bg-cyan-50 p-6 rounded-2xl border border-cyan-200">
          <h3 className="text-lg font-semibold mb-4 border-b border-cyan-300 pb-2 text-gray-900">7. Career Documents & Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-semibold text-cyan-700">Resume / CV</label>
              <input
                type="file"
                name="resume"
                accept=".pdf"
                onChange={handleChange}
                className="file-input"
              />
            </div>
            <input
              type="url"
              name="linkedInProfile"
              placeholder="LinkedIn Profile URL"
              value={form.linkedInProfile}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="url"
              name="portfolioGitHub"
              placeholder="Portfolio / GitHub (if applicable)"
              value={form.portfolioGitHub}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </section>

        {/* 8. Declarations & Acknowledgements */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4 border-b border-blue-300 pb-2 text-gray-900">8. Declarations & Acknowledgements</h3>
          <label className="flex items-center gap-2 text-blue-900 font-semibold cursor-pointer">
            <input
              type="checkbox"
              name="confirmInfo"
              checked={form.declarations.confirmInfo}
              onChange={handleDeclarationChange}
              className="accent-cyan-600"
            />
            I confirm all information provided is accurate and complete.
          </label>
          <label className="flex items-center gap-2 text-blue-900 font-semibold cursor-pointer mt-2">
            <input
              type="checkbox"
              name="authorizeVerify"
              checked={form.declarations.authorizeVerify}
              onChange={handleDeclarationChange}
              className="accent-cyan-600"
            />
            I authorize the company to verify academic, employment, and identification documents.
          </label>
          <label className="flex items-center gap-2 text-blue-900 font-semibold cursor-pointer mt-2">
            <input
              type="checkbox"
              name="allowProcessing"
              checked={form.declarations.allowProcessing}
              onChange={handleDeclarationChange}
              className="accent-cyan-600"
            />
            I allow processing of salary & statutory deductions using the provided bank & ID details.
          </label>
          <label className="flex items-center gap-2 text-blue-900 font-semibold cursor-pointer mt-2">
            <input
              type="checkbox"
              name="acknowledgePolicies"
              checked={form.declarations.acknowledgePolicies}
              onChange={handleDeclarationChange}
              className="accent-cyan-600"
            />
            I acknowledge receipt of the company's policies, privacy notice, and employment terms.
          </label>
        </section>

        <button
          type="submit"
          className="btn-submit w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 transition-all"
        >
          Submit & Continue
        </button>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1.5px solid #38bdf8;
          background: #f8fafc;
          color: #1e293b;
          font-size: 1rem;
          box-shadow: 0 1px 4px 0 #e0e7ef33;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px #38bdf8;
        }
        .file-input {
          width: 100%;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          border: 1.5px solid #38bdf8;
          background: #f8fafc;
          color: #1e293b;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 1px 4px 0 #e0e7ef33;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .btn-add {
          background: #2563eb;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-add:hover {
          background: #1e40af;
        }
        .btn-submit {
          margin-top: 1rem;
        }
      `}</style>
      </motion.form>
    </div>
  </div>
);
}
