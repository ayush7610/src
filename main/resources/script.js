const STORAGE_KEY = 'smartCampusComplaints';
const DEMO_USERS = {
    student: { email: 'student@college.edu', password: 'demo123', role: 'STUDENT', userId: 'student-1' },
    admin: { email: 'admin@college.edu', password: 'demo123', role: 'ADMIN', userId: 'admin-1' }
};

function setDefaultComplaints() {
    const defaultComplaints = [
        {
            id: 'CMP-101',
            userId: 'student-1',
            title: 'Broken classroom fan',
            category: 'ELECTRICAL',
            location: 'Room 204, Block B',
            description: 'Fan is making a loud noise and keeps sparking.',
            priority: 'High',
            status: 'IN_PROGRESS'
        },
        {
            id: 'CMP-102',
            userId: 'student-1',
            title: 'Water leakage in washroom',
            category: 'PLUMBING',
            location: 'Block C, washroom',
            description: 'Water is leaking from the tap and floor is wet.',
            priority: 'Medium',
            status: 'RESOLVED'
        },
        {
            id: 'CMP-103',
            userId: 'student-1',
            title: 'Wi-Fi issue in lab',
            category: 'IT_NETWORK',
            location: 'Lab 2, 1st Floor',
            description: 'Internet keeps dropping during practical classes.',
            priority: 'Low',
            status: 'PENDING'
        }
    ];

    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultComplaints));
    }
}

function getComplaints() {
    setDefaultComplaints();
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (error) {
        return [];
    }
}

function saveComplaints(complaints) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

function getCurrentUserRole() {
    return localStorage.getItem('userRole') || 'STUDENT';
}

function getCurrentUserId() {
    return localStorage.getItem('userId') || 'student-1';
}

function redirectIfRequired() {
    const token = localStorage.getItem('userToken');
    const page = window.location.pathname.split('/').pop();

    if (page === 'index.html' || page === '') {
        if (token) {
            const role = getCurrentUserRole();
            window.location.href = role === 'ADMIN' ? 'admin-dashboard.html' : 'student-portal.html';
        }
        return;
    }

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    if (page === 'student-portal.html' && getCurrentUserRole() !== 'STUDENT') {
        window.location.href = 'index.html';
    }

    if (page === 'admin-dashboard.html' && getCurrentUserRole() !== 'ADMIN') {
        window.location.href = 'index.html';
    }
}

function renderStudentComplaints() {
    const tbody = document.getElementById('complaintsTableBody');
    if (!tbody) return;

    const complaints = getComplaints().filter(item => item.userId === getCurrentUserId());
    tbody.innerHTML = '';

    if (!complaints.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No complaints reported yet.</td></tr>';
        return;
    }

    complaints.forEach((item) => {
        const badgeClass = item.status === 'RESOLVED' ? 'badge-resolved' : item.status === 'IN_PROGRESS' ? 'badge-progress' : 'badge-pending';
        tbody.insertAdjacentHTML('beforeend', `
            <tr>
                <td><strong>${item.id}</strong></td>
                <td>${item.category || 'General'}</td>
                <td>${item.location || 'Campus'}</td>
                <td><span style="font-weight:600; color:#1e3c72;">${item.priority || 'Medium'}</span></td>
                <td><span class="badge ${badgeClass}">${item.status || 'PENDING'}</span></td>
            </tr>
        `);
    });
}

function renderAdminComplaints() {
    const tbody = document.getElementById('adminComplaintsBody');
    if (!tbody) return;

    const complaints = getComplaints();
    tbody.innerHTML = '';

    if (!complaints.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No complaints found.</td></tr>';
        return;
    }

    complaints.forEach((item) => {
        const badgeClass = item.status === 'RESOLVED' ? 'badge-resolved' : item.status === 'IN_PROGRESS' ? 'badge-progress' : 'badge-pending';
        const selectedPending = item.status === 'PENDING' ? 'selected' : '';
        const selectedProgress = item.status === 'IN_PROGRESS' ? 'selected' : '';
        const selectedResolved = item.status === 'RESOLVED' ? 'selected' : '';

        tbody.insertAdjacentHTML('beforeend', `
            <tr>
                <td><strong>${item.id}</strong></td>
                <td>${item.userId === 'student-1' ? 'Student' : 'Guest'}</td>
                <td>${item.category || 'General'} / ${item.title || 'Issue'}</td>
                <td>${item.location || 'Campus'}</td>
                <td><span style="font-weight:600; color:#1e3c72;">${item.priority || 'Medium'}</span></td>
                <td>
                    <span class="badge ${badgeClass}">${item.status || 'PENDING'}</span>
                    <select class="status-select" data-id="${item.id}" style="margin-top:8px; width:100%; padding:6px; border-radius:6px; border:1px solid #d9dfe8;">
                        <option value="PENDING" ${selectedPending}>Pending</option>
                        <option value="IN_PROGRESS" ${selectedProgress}>In Progress</option>
                        <option value="RESOLVED" ${selectedResolved}>Resolved</option>
                    </select>
                </td>
                <td>${item.description || 'No details provided.'}</td>
            </tr>
        `);
    });

    document.querySelectorAll('.status-select').forEach((select) => {
        select.addEventListener('change', (event) => {
            const targetId = event.target.getAttribute('data-id');
            const nextStatus = event.target.value;
            const allComplaints = getComplaints();
            const updated = allComplaints.map((item) => item.id === targetId ? { ...item, status: nextStatus } : item);
            saveComplaints(updated);
            renderAdminComplaints();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    redirectIfRequired();

    const roleButtons = document.querySelectorAll('.role-btn');
    if (roleButtons.length) {
        let currentRole = getCurrentUserRole() === 'ADMIN' ? 'ADMIN' : 'STUDENT';

        roleButtons.forEach((btn) => {
            const btnRole = btn.getAttribute('data-role');
            if (btnRole === currentRole) btn.classList.add('active');
            btn.addEventListener('click', () => {
                roleButtons.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                currentRole = btn.getAttribute('data-role');
                const emailInput = document.getElementById('email');
                if (emailInput) {
                    emailInput.placeholder = currentRole === 'ADMIN' ? 'admin@college.edu' : 'student@college.edu';
                }
            });
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const alertBox = document.getElementById('alertMessage');
            const submitBtn = document.getElementById('loginBtn');
            const selectedRole = document.querySelector('.role-btn.active')?.getAttribute('data-role') || 'STUDENT';
            const emailValue = (email?.value || '').trim().toLowerCase();
            const passwordValue = password?.value || '';

            if (submitBtn) {
                submitBtn.innerText = 'Signing in...';
                submitBtn.disabled = true;
            }

            const matchingUser = Object.values(DEMO_USERS).find((user) => {
                return user.role === selectedRole && user.email === emailValue && user.password === passwordValue;
            });

            if (matchingUser) {
                localStorage.setItem('userToken', 'demo-token');
                localStorage.setItem('userRole', matchingUser.role);
                localStorage.setItem('userId', matchingUser.userId);
                localStorage.setItem('userEmail', matchingUser.email);

                if (alertBox) {
                    alertBox.className = 'alert-box success';
                    alertBox.innerText = 'Login Successful! Redirecting...';
                    alertBox.classList.remove('hide');
                }

                setTimeout(() => {
                    window.location.href = matchingUser.role === 'ADMIN' ? 'admin-dashboard.html' : 'student-portal.html';
                }, 600);
                return;
            }

            if (alertBox) {
                alertBox.className = 'alert-box error';
                alertBox.innerText = 'Invalid credentials. Use student@college.edu / demo123 or admin@college.edu / demo123.';
                alertBox.classList.remove('hide');
            }

            if (submitBtn) {
                submitBtn.innerText = 'Sign In';
                submitBtn.disabled = false;
            }
        });
    }

    const complaintForm = document.getElementById('complaintForm');
    if (complaintForm) {
        complaintForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const category = document.getElementById('category')?.value || 'GENERAL';
            const title = document.getElementById('title')?.value || 'Campus issue';
            const location = document.getElementById('location')?.value || 'Campus';
            const description = document.getElementById('description')?.value || 'Issue reported';
            const allComplaints = getComplaints();
            const nextComplaint = {
                id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
                userId: getCurrentUserId(),
                title,
                category,
                location,
                description,
                priority: 'Medium',
                status: 'PENDING'
            };

            allComplaints.unshift(nextComplaint);
            saveComplaints(allComplaints);

            const msgBox = document.getElementById('formMsg');
            if (msgBox) {
                msgBox.className = 'alert alert-box success';
                msgBox.innerText = `Complaint Registered! Tracking ID: ${nextComplaint.id}`;
                msgBox.classList.remove('hide');
            }

            complaintForm.reset();
            renderStudentComplaints();
        });
    }

    renderStudentComplaints();
    renderAdminComplaints();

    const displayUserName = document.getElementById('displayUserName');
    if (displayUserName) {
        const role = getCurrentUserRole();
        displayUserName.innerHTML = `<i class="fa-solid fa-user"></i> ${role === 'ADMIN' ? 'Admin' : 'Student'}`;
    }

    document.querySelectorAll('.logout-btn').forEach((button) => {
        button.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    });
}); 