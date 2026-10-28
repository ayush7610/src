# Smart Campus — corrected frontend demo

## Important limitation
These files make the **frontend demo** work without a backend: demo login, student complaint submission, persistent complaint listing in browser `localStorage`, and a simple admin status editor. This is **not secure authentication**. Complaints are stored only in the same browser/profile and are not sent to MySQL. A selected photo is not uploaded or saved.

The Java/Spring Boot (or other) backend files were not supplied, so no real `/api/complaints` endpoint or database integration has been implemented or tested.

## Run in VS Code
1. Open the repository folder in VS Code.
2. Install/use the **Live Server** extension, then right-click `main/resources/index.html` → **Open with Live Server**.
3. Use one of these demo accounts:
   - Student: `student@college.edu` / `demo123`
   - Admin: `admin@college.edu` / `demo123`
5. Submit a complaint as the student, then log in as admin in the same browser to view it and change its status.

Avoid opening the HTML files directly with `file://`; Live Server is recommended.

## Deploy with GitHub Pages
The repository includes a GitHub Actions workflow that publishes `main/resources` on every push to `main`. Make the repository public, then open **Settings → Pages** and select **GitHub Actions** as the build and deployment source if it is not selected automatically. After the workflow succeeds, the site URL is `https://ayush7610.github.io/src/`.

## Files
- `main/resources/index.html`: login screen
- `main/resources/style.css`: shared responsive styling
- `main/resources/script.js`: shared frontend script
- `main/resources/student-portal.html`: complaint form and student's list
- `main/resources/admin-dashboard.html`: demo admin list/status editor
- `.github/workflows/deploy-pages.yml`: GitHub Pages deployment workflow
- `schema.sql`: corrected MySQL schema with a departments table and foreign keys

## Before production
Implement a server-side login endpoint with password hashing and role authorization; create complaint APIs that validate the logged-in user on the server; save complaints and status history in MySQL; implement multipart image upload with file type/size validation. Do not trust role values or user IDs supplied by the browser. Replace the demo frontend logic with API calls only after the backend contract is known.
