/**
 * Mock Data Service
 * Generates sample data for the HRMS to support UI testing when the database is unreachable.
 */

const generateMockEmployees = (count = 10) => {
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];
  const positions = ['Manager', 'Developer', 'Specialist', 'Clerk', 'Supervisor'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-emp-${i + 1}`,
    employeeId: `EMP${1000 + i}`,
    firstName: `Employee`,
    lastName: `Name ${i + 1}`,
    fullName: `Employee Name ${i + 1}`,
    email: `employee${i + 1}@example.com`,
    phoneNumber: `091122334${i}`,
    status: i % 3 === 0 ? 'On Probation' : 'Active',
    employmentType: 'Full-time',
    department: { name: departments[i % departments.length] },
    position: positions[i % positions.length],
    branch: i % 2 === 0 ? 'Addis Ababa' : 'Dire Dawa',
    hireDate: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
    isActive: true
  }));
};

const generateMockDepartments = () => {
  const names = ['Information Technology', 'Human Resources', 'Finance', 'Marketing', 'Operations', 'Research', 'Academic', 'Vocational'];
  return names.map((name, i) => ({
    id: `mock-dept-${i + 1}`,
    name,
    code: name.substring(0, 3).toUpperCase(),
    description: `The ${name} department`,
    manager: { fullName: `Manager ${i + 1}` }
  }));
};

const generateMockPositions = () => {
  const names = ['Senior Developer', 'HR Specialist', 'Financial Analyst', 'Marketing Coordinator', 'Security Guard', 'Cleaner', 'Instructor'];
  return names.map((name, i) => ({
    id: `mock-pos-${i + 1}`,
    name,
    code: name.substring(0, 3).toUpperCase(),
    description: `Professional ${name} role`
  }));
};

const generateMockPrograms = (count = 10) => {
  const types = ['Vocational', 'Academic', 'Short Course', 'Workshop'];
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-prog-${i + 1}`,
    name: `Program ${i + 1}`,
    code: `PROG${100 + i}`,
    type: types[i % types.length],
    duration: `${(i % 4) + 1} Years`,
    description: `Sample description for ${types[i % types.length]} program ${i + 1}.`,
    departmentId: `mock-dept-${(i % 5) + 1}`,
    isActive: true
  }));
};

const generateMockStudents = (count = 10) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-student-${i + 1}`,
    studentId: `STU${2000 + i}`,
    firstName: `Student`,
    lastName: `Name ${i + 1}`,
    email: `student${i + 1}@example.com`,
    phone: `092233445${i}`,
    gender: i % 2 === 0 ? 'Male' : 'Female',
    programId: `mock-prog-${(i % 10) + 1}`,
    levelId: `mock-level-${(i % 4) + 1}`,
    status: i % 5 === 0 ? 'Inactive' : 'Active',
    enrollmentDate: new Date(2023, 8, (i % 30) + 1).toISOString()
  }));
};

const generateMockLeaveRequests = (count = 10) => {
  const types = ['Annual', 'Sick', 'Maternity', 'Compensatory', 'Other'];
  const statuses = ['Pending', 'Approved', 'Rejected'];
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-leave-${i + 1}`,
    employeeId: `mock-emp-${(i % 10) + 1}`,
    employeeName: `Employee Name ${(i % 10) + 1}`,
    leaveType: types[i % types.length],
    startDate: new Date(2024, 3, (i % 28) + 1).toISOString(),
    endDate: new Date(2024, 3, (i % 28) + 3).toISOString(),
    reason: `Sample reason for ${types[i % types.length]} leave request.`,
    status: statuses[i % statuses.length],
    appliedDate: new Date(2024, 3, 1).toISOString()
  }));
};

const generateMockProjects = (count = 10) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-proj-${i + 1}`,
    name: `Project ${String.fromCharCode(65 + i)}`,
    code: `PRJ${500 + i}`,
    description: `A sample project for testing purposes.`,
    status: i % 2 === 0 ? 'Active' : 'Completed',
    startDate: '2023-01-01',
    endDate: '2023-12-31'
  }));
};

const generateMockAuditLogs = (count = 10) => {
  const actions = ['Login', 'Create Employee', 'Update Profile', 'Delete Record', 'Export Data'];
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-audit-${i + 1}`,
    userId: 'mock-admin-id',
    userName: 'Development Admin',
    action: actions[i % actions.length],
    resource: 'System',
    details: `Performed ${actions[i % actions.length]} action in Mock Mode.`,
    ipAddress: '127.0.0.1',
    createdAt: new Date(Date.now() - i * 3600000).toISOString()
  }));
};

const generateMockDashboardStats = () => ({
  totalEmployees: 150,
  activeEmployees: 142,
  departments: 8,
  avgSalary: "12,500 ETB",
  recentHires: 10,
  openPositions: 5,
  leaveRequests: 3
});

const generateMockChartData = {
  departmentDistribution: [
    { name: 'IT', count: 45 },
    { name: 'HR', count: 12 },
    { name: 'Finance', count: 18 },
    { name: 'Marketing', count: 25 },
    { name: 'Operations', count: 50 }
  ],
  statusDistribution: [
    { name: 'Active', count: 142 },
    { name: 'On Probation', count: 8 },
    { name: 'Terminated', count: 2 }
  ],
  studentAgeDistribution: [
    { age_group: '18-21', count: 120 },
    { age_group: '22-25', count: 85 },
    { age_group: '26-30', count: 40 },
    { age_group: '30+', count: 15 }
  ],
  hiringTrends: [
    { month: 'Jan', count: 5 },
    { month: 'Feb', count: 8 },
    { month: 'Mar', count: 12 },
    { month: 'Apr', count: 7 },
    { month: 'May', count: 15 },
    { month: 'Jun', count: 9 }
  ],
  leaveTypeDistribution: [
    { name: 'Annual', count: 45 },
    { name: 'Sick', count: 22 },
    { name: 'Maternity', count: 5 },
    { name: 'Other', count: 10 }
  ],
  genderDistribution: [
    { gender: 'Male', count: 85 },
    { gender: 'Female', count: 65 }
  ]
};

module.exports = {
  generateMockEmployees,
  generateMockDepartments,
  generateMockPositions,
  generateMockPrograms,
  generateMockStudents,
  generateMockLeaveRequests,
  generateMockProjects,
  generateMockAuditLogs,
  generateMockDashboardStats,
  generateMockChartData
};
