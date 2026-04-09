require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hrms.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234';

let token = '';

async function testApi(name, path, method = 'GET', body = null) {
    process.stdout.write(`Testing ${name} (${method} ${path})... `);
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(`${BASE_URL}${path}`, options);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ PASS');
            return data;
        } else {
            console.log(`❌ FAIL (${response.status}): ${data.message || 'Unknown error'}`);
            return null;
        }
    } catch (err) {
        console.log(`❌ ERROR: ${err.message}`);
        return null;
    }
}

async function runTests() {
    console.log('--- HRMS API Verification ---');

    // 1. Auth
    const loginRes = await testApi('Login', '/auth/login', 'POST', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    if (!loginRes) return console.log('Aborting: Login failed');
    token = loginRes.token;

    await testApi('Get Profile', '/users/me');

    // 2. Departments
    const dept = await testApi('Create Department', '/departments', 'POST', {
        name: 'Test Dept ' + Date.now(),
        description: 'Auto-generated test department'
    });
    if (dept && dept.data) {
        const deptId = dept.data.id;
        await testApi('List Departments', '/departments');
        await testApi('Update Department', `/departments/${deptId}`, 'PUT', { name: 'Updated Dept' });
        // Deleting it later or keeping it? Let's delete to keep it clean
        await testApi('Delete Department', `/departments/${deptId}`, 'DELETE');
    }

    // 3. Roles
    const role = await testApi('Create Role', '/roles', 'POST', { name: 'Test Role ' + Date.now() });
    if (role && role.data) {
        const roleId = role.data.id;
        await testApi('List Roles', '/roles');
        await testApi('Update Role', `/roles/${roleId}`, 'PUT', { name: 'Updated Role ' + Date.now() });
        await testApi('Delete Role', `/roles/${roleId}`, 'DELETE');
    }

    // 4. Employees
    // Need a real department for employee
    const tempDept = await testApi('Create Temp Dept for Employee', '/departments', 'POST', {
        name: 'Employee Test Dept ' + Date.now(),
        description: 'Auto-generated test department'
    });
    if (tempDept && tempDept.data) {
        const deptId = tempDept.data.id;
        const emp = await testApi('Create Employee', '/employees', 'POST', {
            firstName: 'Test',
            lastName: 'User',
            email: `test.${Date.now()}@test.com`,
            phone: '0912345678',
            departmentId: deptId,
            position: 'Tester',
            hireDate: '2024-01-01',
            salary: 50000
        });

        if (emp && emp.data) {
            const empId = emp.data.id;
            await testApi('List Employees', '/employees');
            await testApi('Get Employee by ID', `/employees/${empId}`);
            await testApi('Update Employee', `/employees/${empId}`, 'PUT', { firstName: 'Updated' });
            await testApi('Update Employee Status', `/employees/${empId}/status`, 'PATCH', { status: 'leave' });
            await testApi('Delete Employee', `/employees/${empId}`, 'DELETE');
        }
        await testApi('Cleanup Temp Dept', `/departments/${deptId}`, 'DELETE');
    }

    // 5. Users
    const tempRole = await testApi('Create Temp Role for User', '/roles', 'POST', { name: 'User Test Role ' + Date.now() });
    if (tempRole && tempRole.data) {
        const roleId = tempRole.data.id;
        const user = await testApi('Create User', '/users', 'POST', {
            name: 'Test User',
            email: `user.${Date.now()}@test.com`,
            roleId: roleId
        });

        if (user && user.data) {
            const userId = user.data.id;
            await testApi('List Users', '/users');
            await testApi('Get User by ID', `/users/${userId}`);
            await testApi('Update User', `/users/${userId}`, 'PUT', { name: 'Updated User' });
            await testApi('Delete User', `/users/${userId}`, 'DELETE');
        }
        await testApi('Cleanup Temp Role', `/roles/${roleId}`, 'DELETE');
    }

    // 6. Dashboard & Analytics
    await testApi('Dashboard Summary', '/dashboard/summary');
    await testApi('Employee Status Distribution', '/dashboard/employee-status');
    await testApi('Hiring Trend', '/dashboard/hiring-trend?year=2024');
    await testApi('Department Distribution', '/analytics/department-distribution');
    await testApi('Users by Role', '/dashboard/users-by-role');
    await testApi('Audit Logs', '/dashboard/audit-logs');

    console.log('--- Verification Complete ---');
}

runTests();
