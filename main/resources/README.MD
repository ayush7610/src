# Smart Campus — corrected frontend demo

## Important limitation
These files make the **frontend demo** work without a backend: demo login, student complaint submission, persistent complaint listing in browser `localStorage`, and a simple admin status editor. This is **not secure authentication**. Complaints are stored only in the same browser/profile and are not sent to MySQL. A selected photo is not uploaded or saved.

The Java/Spring Boot (or other) backend files were not supplied, so no real `/api/complaints` endpoint or database integration has been implemented or tested.

## Run in VS Code
1. Extract this folder.
2. Open the `smart-campus-fixed` folder in VS Code.
3. Install/use the **Live Server** extension, then right-click `index.html` → **Open with Live Server**.
4. Use one of these demo accounts:
   - Student: `student@college.edu` / `demo123`
   - Admin: `admin@college.edu` / `demo123`
5. Submit a complaint as the student, then log in as admin in the same browser to view it and change its status.

Avoid opening the HTML files directly with `file://`; Live Server is recommended.

## Files
- `index.html`: login screen
- `style.css`: shared responsive styling
- `script.js`: single shared frontend script; no duplicate inline handlers
- `student-portal.html`: complaint form and student's list
- `admin-dashboard.html`: demo admin list/status editor
- `schema.sql`: corrected MySQL schema with a departments table and foreign keys

## Before production
Implement a server-side login endpoint with password hashing and role authorization; create complaint APIs that validate the logged-in user on the server; save complaints and status history in MySQL; implement multipart image upload with file type/size validation. Do not trust role values or user IDs supplied by the browser. Replace the demo frontend logic with API calls only after the backend contract is known.
