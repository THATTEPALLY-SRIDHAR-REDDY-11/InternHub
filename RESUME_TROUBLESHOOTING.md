# Resume Builder - Troubleshooting Guide

## 🔍 Common Issues & Solutions

### Issue: "Unable to Save Resume"

#### **Solution 1: Check if you're logged in**
1. Look at the top of the Resume Builder page
2. If you see a yellow warning box saying "Not Logged In", click "Login here"
3. After logging in, you should see "Logged in as [your-email]" under the title

#### **Solution 2: Fill in required fields**
The resume builder requires:
- ✅ **Full Name** (marked with red *)
- ✅ **Email** (marked with red *)

**Steps:**
1. Go to the **Personal** tab
2. Fill in your Full Name and Email
3. Try saving again

#### **Solution 3: Check browser console for errors**
1. Press **F12** to open Developer Tools
2. Click on the **Console** tab
3. Look for red error messages
4. You should see logs like:
   - "Saving resume for user: [user-id]"
   - "Resume payload: {...}"
   - "Server response: {...}"

If you see errors, take note of them and check below.

---

## 🚨 Error Messages Explained

### "Please login to save your resume"
- **Cause**: Not authenticated
- **Fix**: Click "Login here" or navigate to `/auth` to sign in

### "Please fill in your Full Name and Email in the Personal tab"
- **Cause**: Required fields are empty
- **Fix**: 
  1. Click on the **Personal** tab
  2. Fill in Full Name and Email fields (marked with *)
  3. Click Save again

### "Failed to save resume"
- **Cause**: Backend server issue or network error
- **Fix**: 
  1. Check if backend is running: Open `http://localhost:4000` in browser
  2. Should show: `{"message":"Welcome to InternHub API","version":"1.0.0"}`
  3. If not, restart the backend server

---

## ✅ Step-by-Step: How to Save Your Resume

1. **Login First**
   - Go to `/auth` and sign in
   - You'll be redirected to dashboard

2. **Navigate to Resume Builder**
   - Click "Resume" in the navbar
   - Or go to `/resume`

3. **Fill Required Information**
   - Click **Personal** tab
   - Enter your **Full Name** ✱
   - Enter your **Email** ✱
   - Add other optional info (phone, location, summary)

4. **Add Additional Sections (Optional)**
   - **Skills**: Add skills one by one, press Enter or click +
   - **Education**: Add your educational background
   - **Experience**: Add work experience
   - **Projects**: Showcase your projects
   - **Certifications**: List your certificates

5. **Save Your Resume**
   - Click the **Save** button (top right)
   - Wait for "Resume saved successfully! ✓" message
   - Your resume is now saved!

6. **Preview Your Resume**
   - Click **Preview** button to see how it looks
   - Click **Edit** to go back and make changes

---

## 🔧 Backend Server Check

### Check if backend is running:
```bash
# Open new terminal in the server directory
cd server
npm start
```

Should see:
```
[InternHub] API server listening on http://localhost:4000
```

### Test backend directly:
Open browser and go to: `http://localhost:4000`

Expected response:
```json
{
  "message": "Welcome to InternHub API",
  "version": "1.0.0"
}
```

---

## 📝 Testing the Save Endpoint

### Using Browser Console:

1. Open Resume Builder page
2. Press F12 → Console tab
3. Paste and run:

```javascript
// Test save with minimal data
fetch('http://localhost:4000/resumes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'test-user-123',
    personal_info: {
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: []
  })
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

Expected: Should see "Success: {...}" with your resume data

---

## 🐛 Still Having Issues?

### Check MongoDB Connection:
If you're using MongoDB, check your `.env` file in the `server` folder:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=internhub
```

If MongoDB is not connected, the app will use in-memory storage (data won't persist after restart).

### CORS Issues:
The backend allows these origins:
- http://localhost:8080
- http://localhost:8081
- http://localhost:8082
- http://localhost:8083

If your frontend is on a different port, add it to `server/index.js` in the CORS configuration.

---

## 💡 Tips for Best Results

1. **Fill Personal Info First**: Always start with the Personal tab and fill required fields
2. **Use Preview**: Check how your resume looks before finalizing
3. **Save Frequently**: Click Save after major changes
4. **Browser Console**: Keep F12 console open while testing to see detailed logs
5. **Required Fields**: Look for red asterisk (*) - these must be filled

---

## 📞 Quick Reference

**Required to Save:**
- ✅ Logged in user
- ✅ Full Name filled
- ✅ Email filled

**Optional Sections:**
- Phone, Location, Summary
- Education, Experience, Projects
- Skills, Certifications

**Keyboard Shortcuts:**
- **Enter**: Add skill (in Skills tab)
- **F12**: Open developer tools
- **Ctrl+S**: Save (if you add this feature)

---

## 🎯 Success Indicators

When everything works correctly, you should see:
1. ✅ "Logged in as [your-email]" under the title
2. ✅ Console log: "Saving resume for user: [user-id]"
3. ✅ Console log: "Server response: {...}"
4. ✅ Toast notification: "Resume saved successfully! ✓"

Happy Resume Building! 🎉
