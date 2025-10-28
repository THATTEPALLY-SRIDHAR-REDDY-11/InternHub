# New Features Guide

## 🎉 Three New Features Added to InternHub

### 1. **File Upload** 📤

Upload resumes, portfolios, and other documents.

**Usage:**
```typescript
import { FileUpload } from '@/components/FileUpload';

// In your component
<FileUpload 
  onUploadComplete={(fileData) => {
    console.log('File uploaded:', fileData.url);
  }}
  acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  maxSize={5} // 5MB
/>
```

**Backend Endpoint:**
- `POST /upload` - Upload a file (multipart/form-data)
- Files are stored in `server/uploads/` directory
- Returns: `{ url, filename, originalName, size }`

---

### 2. **User Reviews & Ratings** ⭐

Add reviews and ratings for internships and projects.

**Usage:**
```typescript
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewsList } from '@/components/ReviewsList';

// Add a review form
<ReviewForm
  targetType="internship" // or "project"
  targetId={internshipId}
  userId={user.id}
  userName={user.name}
  onReviewSubmitted={() => {
    // Refresh reviews list
  }}
/>

// Display reviews
<ReviewsList
  targetType="internship"
  targetId={internshipId}
  refreshTrigger={refreshCount}
/>
```

**Backend Endpoints:**
- `POST /reviews` - Create a review
  ```json
  {
    "target_type": "internship",
    "target_id": "12345",
    "user_id": "user123",
    "user_name": "John Doe",
    "rating": 4,
    "comment": "Great experience!"
  }
  ```
- `GET /reviews/:target_type/:target_id` - Get all reviews for a target
  - Returns: `{ reviews: [], avgRating: 4.5, count: 10 }`

---

### 3. **Resume Builder** 📝

Complete resume builder with preview and export functionality.

**Access:** Navigate to `/resume` or click "Resume" in the navbar

**Features:**
- **Personal Information**: Name, email, phone, social links, summary
- **Education**: Add multiple education entries
- **Work Experience**: Track current and past positions
- **Projects**: Showcase your work with technologies
- **Skills**: Tag-based skill management
- **Certifications**: Professional certificates

**Backend Endpoints:**
- `POST /resumes` - Create or update resume
  ```json
  {
    "user_id": "user123",
    "personal_info": {
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "New York, NY",
      "summary": "Software developer with 3 years experience..."
    },
    "education": [...],
    "experience": [...],
    "projects": [...],
    "skills": ["React", "Node.js", "MongoDB"],
    "certifications": [...]
  }
  ```
- `GET /resumes/:user_id` - Retrieve resume by user ID
- `DELETE /resumes/:user_id` - Delete resume

---

## 🚀 Quick Start

### Add Reviews to Your Project/Internship Pages

1. Import components:
```typescript
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewsList } from '@/components/ReviewsList';
```

2. Add to your page:
```typescript
const [refreshReviews, setRefreshReviews] = useState(0);

// In your JSX
<div className="space-y-6">
  <ReviewForm
    targetType="project"
    targetId={projectId}
    userId={user?.id}
    userName={user?.name}
    onReviewSubmitted={() => setRefreshReviews(prev => prev + 1)}
  />
  <ReviewsList
    targetType="project"
    targetId={projectId}
    refreshTrigger={refreshReviews}
  />
</div>
```

### Add File Upload to Application Forms

```typescript
import { FileUpload } from '@/components/FileUpload';

const [resumeUrl, setResumeUrl] = useState('');

<FileUpload 
  onUploadComplete={(fileData) => {
    setResumeUrl(fileData.url);
    // Now you can submit this URL with your application
  }}
/>
```

---

## 📦 Database Schema

### Reviews Collection
```javascript
{
  target_type: String,     // 'internship' or 'project'
  target_id: String,       // ID of internship/project
  user_id: String,         // ID of reviewer
  user_name: String,       // Name of reviewer
  rating: Number,          // 1-5
  comment: String,         // Review text
  created_at: Date
}
```

### Resumes Collection
```javascript
{
  user_id: String,         // Unique user identifier
  personal_info: Object,   // Contact and summary
  education: Array,        // Education history
  experience: Array,       // Work experience
  projects: Array,         // Project portfolio
  skills: Array,           // Skills list
  certifications: Array,   // Certifications
  created_at: Date,
  updated_at: Date
}
```

---

## 🔧 File Upload Configuration

- **Max file size**: 5MB (configurable in `server/index.js`)
- **Allowed types**: PDF, DOC, DOCX, JPG, JPEG, PNG
- **Storage location**: `server/uploads/`
- **Access URL pattern**: `http://localhost:4000/uploads/[filename]`

---

## 💡 Tips

1. **Reviews**: Always check if user is authenticated before showing the review form
2. **File Upload**: Display upload progress for better UX (can be enhanced)
3. **Resume Builder**: Encourage users to preview before saving
4. **Validation**: Add client-side validation for better user experience

---

## 🐛 Troubleshooting

**File upload fails:**
- Check if `server/uploads/` directory exists
- Verify file size is under 5MB
- Ensure file type is allowed

**Reviews not showing:**
- Check if MongoDB is connected
- Verify the target_id matches your resource ID
- Check browser console for errors

**Resume not saving:**
- Ensure user is logged in
- Check if personal_info fields are filled
- Verify MongoDB connection

---

Happy coding! 🎉
