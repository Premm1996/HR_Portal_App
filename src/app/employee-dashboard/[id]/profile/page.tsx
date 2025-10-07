"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Target,
  Award,
  BookOpen,
  Bell,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Building,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Eye,
  Star,
  Zap,
  Activity,
  MessageSquare,
  Gift,
  AlertTriangle,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [employee, setEmployee] = useState<any>({});
  const [attendance, setAttendance] = useState<any>({});
  const [payroll, setPayroll] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await api.get(`/employees/${params.id}/profile`);
        setEmployee(empRes.data);

        const attRes = await api.get(`/attendance/summary/${params.id}`);
        setAttendance(attRes.data);

        const payRes = await api.get(`/finance/payroll-history`);
        setPayroll(payRes.data);
      } catch (err) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on leave': return 'bg-yellow-100 text-yellow-800';
      case 'notice period': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Override DashboardLayout dark theme */}
      <style jsx global>{`
        body { background-color: #f9fafb !important; }
        .min-h-screen { background-color: #f9fafb !important; }
      `}</style>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Top Section – Employee Snapshot */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-lg">
                  {employee.photo ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${employee.photo}`}
                      alt={employee.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              {/* Employee Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {getGreeting()}, {employee.fullName?.split(' ')[0]}! 👋
                  </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employee ID</Label>
                    <p className="text-sm font-semibold text-gray-900">{employee.employeeId || employee.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Job Title</Label>
                    <p className="text-sm font-semibold text-gray-900">{employee.jobTitle || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</Label>
                    <p className="text-sm font-semibold text-gray-900">{employee.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reporting Manager</Label>
                    <p className="text-sm font-semibold text-gray-900">{employee.managerName || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={`${getStatusColor(employee.status)} px-3 py-1`}>
                    {employee.status || 'Active'}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {employee.location || 'Remote'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'Not specified'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Attendance Card */}
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Attendance</h3>
                    <p className="text-sm text-gray-600">Today's Status</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/employee-dashboard/attendance')}
                  className="text-teal-600 hover:text-teal-700"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View More
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Today</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Present
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monthly Attendance</span>
                  <span className="text-sm font-semibold text-gray-900">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Working Hours</span>
                  <span className="text-sm font-semibold text-gray-900">8h 30m</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payroll Card */}
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Payroll</h3>
                    <p className="text-sm text-gray-600">Latest Payment</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/employee-dashboard/payslips')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View More
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Credited</span>
                  <span className="text-sm font-semibold text-gray-900">Dec 25, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-sm font-semibold text-gray-900">₹75,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Paid
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Balance Card */}
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Leave Balance</h3>
                    <p className="text-sm text-gray-600">Current Year</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/employee-dashboard/attendance/leave-application')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Apply
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Annual Leave</span>
                  <span className="text-sm font-semibold text-gray-900">18 / 24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sick Leave</span>
                  <span className="text-sm font-semibold text-gray-900">5 / 12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Casual Leave</span>
                  <span className="text-sm font-semibold text-gray-900">8 / 12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance & Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Target className="w-5 h-5 text-teal-600" />
                Current OKRs & Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(employee.goals || [
                { title: "Complete React Certification", progress: 75, deadline: "Jan 2025" },
                { title: "Lead Team Project", progress: 60, deadline: "Feb 2025" },
                { title: "Improve Code Quality Metrics", progress: 85, deadline: "Mar 2025" }
              ]).slice(0, 3).map((goal: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{goal.title}</span>
                    <span className="text-xs text-gray-500">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Deadline: {goal.deadline}</span>
                    <Badge variant="outline" className="text-xs">
                      {goal.progress >= 80 ? 'On Track' : goal.progress >= 60 ? 'Good Progress' : 'Needs Attention'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Latest Performance Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-900">Q4 2024 Review</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">Excellent</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {employee.feedback || "Outstanding performance in the recent project delivery. Demonstrated excellent leadership skills and technical expertise. Keep up the great work!"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Manager: {employee.managerName || 'John Smith'}</span>
                    <span>Dec 15, 2024</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Achievements & Recognitions</h4>
                  <div className="flex flex-wrap gap-2">
                    {(employee.achievements || ["Employee of the Month", "Project Excellence Award", "Innovation Champion"]).map((achievement: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects & Work Allocation */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Current Projects & Work Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(employee.currentProjects || [
                {
                  name: "E-commerce Platform Redesign",
                  role: "Frontend Lead",
                  status: "In Progress",
                  progress: 65,
                  tools: ["React", "TypeScript", "Figma"],
                  links: [
                    { type: "jira", url: "#", label: "Jira Board" },
                    { type: "github", url: "#", label: "Repository" },
                    { type: "figma", url: "#", label: "Design System" }
                  ]
                },
                {
                  name: "Mobile App Development",
                  role: "Technical Consultant",
                  status: "Planning",
                  progress: 25,
                  tools: ["React Native", "Node.js"],
                  links: [
                    { type: "jira", url: "#", label: "Backlog" },
                    { type: "confluence", url: "#", label: "Documentation" }
                  ]
                }
              ]).map((project: any, idx: number) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    <Badge className={`${
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {project.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium text-gray-900">{project.role}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Tools & Technologies:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.tools.map((tool: string, toolIdx: number) => (
                          <Badge key={toolIdx} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700">Quick Links:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {project.links.map((link: any, linkIdx: number) => (
                          <Button key={linkIdx} variant="outline" size="sm" className="text-xs h-7">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {link.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning & Development */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <BookOpen className="w-5 h-5 text-green-600" />
                Learning & Development
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Assigned Trainings</h4>
                <div className="space-y-3">
                  {[
                    { title: "Advanced React Patterns", deadline: "Jan 30, 2025", progress: 40 },
                    { title: "Leadership Skills Workshop", deadline: "Feb 15, 2025", progress: 0 },
                    { title: "Cloud Architecture Fundamentals", deadline: "Mar 10, 2025", progress: 20 }
                  ].map((training, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{training.title}</p>
                        <p className="text-xs text-gray-500">Deadline: {training.deadline}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={training.progress} className="w-16 h-2" />
                        <span className="text-xs text-gray-600 w-8">{training.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                Certifications & Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Completed Certifications</h4>
                <div className="space-y-2">
                  {(employee.certifications || [
                    "AWS Certified Developer",
                    "React Professional Certification",
                    "Scrum Master Certification"
                  ]).map((cert: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Skills to Improve</h4>
                <div className="space-y-2">
                  {[
                    { skill: "System Design", priority: "High" },
                    { skill: "DevOps Practices", priority: "Medium" },
                    { skill: "Data Structures", priority: "Low" }
                  ].map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                      <span className="text-sm text-gray-700">{skill.skill}</span>
                      <Badge className={`${
                        skill.priority === 'High' ? 'bg-red-100 text-red-800' :
                        skill.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {skill.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements & Notifications */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Bell className="w-5 h-5 text-orange-600" />
              Announcements & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* HR Announcements */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">HR Announcements</h4>
                <div className="space-y-3">
                  {[
                    {
                      title: "Holiday Calendar 2025",
                      message: "New holiday calendar has been published. Check the updated list of public holidays.",
                      date: "Dec 20, 2024",
                      type: "holiday"
                    },
                    {
                      title: "New Policy Updates",
                      message: "Updated remote work and flexible hours policy is now available.",
                      date: "Dec 18, 2024",
                      type: "policy"
                    },
                    {
                      title: "Q4 Town Hall Meeting",
                      message: "Join us for the quarterly town hall on January 15th, 2025.",
                      date: "Dec 15, 2024",
                      type: "meeting"
                    }
                  ].map((announcement, idx) => (
                    <div key={idx} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          announcement.type === 'holiday' ? 'bg-green-100' :
                          announcement.type === 'policy' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }`}>
                          {announcement.type === 'holiday' ? <Gift className="w-4 h-4 text-green-600" /> :
                           announcement.type === 'policy' ? <Award className="w-4 h-4 text-blue-600" /> :
                           <Users className="w-4 h-4 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{announcement.title}</h5>
                          <p className="text-xs text-gray-600 mt-1">{announcement.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Birthdays & Alerts */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Celebrations & Alerts</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Gift className="w-6 h-6 text-pink-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Sarah's Birthday Today! 🎉</p>
                        <p className="text-xs text-gray-600">Don't forget to wish her!</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Work Anniversary</p>
                        <p className="text-xs text-gray-600">Mike completed 3 years with us!</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Pending Actions</p>
                        <p className="text-xs text-gray-600">2 leave requests awaiting approval</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
