# Update Profile Feature Documentation

## 🔄 Overview

Fitur **Update Profile** memungkinkan user yang sudah login untuk memperbarui informasi profil mereka seperti username, email, dan password.

---

## 📝 API Endpoint

### `PUT /auth/profile`

**Description**: Update user profile information  
**Authentication**: Required (JWT Bearer Token)  
**Content-Type**: `application/json`

---

## 🔧 Request Specification

### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Request Body (UpdateProfileDto)
```typescript
{
  username?: string;    // Optional: New username
  email?: string;       // Optional: New email address  
  password?: string;    // Optional: New password (min 6 characters)
}
```

### Validation Rules
- **username**: Optional string, must be unique if provided
- **email**: Optional valid email format
- **password**: Optional string, minimum 6 characters if provided

---

## 📤 Response Specification

### Success Response (200)
```json
{
  "id": 1,
  "username": "john_doe_updated",
  "email": "john.updated@example.com", 
  "role": "member"
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 400 Bad Request - Username Exists
```json
{
  "statusCode": 401,
  "message": "Username already exists"
}
```

#### 400 Bad Request - User Not Found
```json
{
  "statusCode": 401,
  "message": "User not found"
}
```

---

## 🔒 Security Features

### 1. Authentication Required
- Endpoint requires valid JWT token
- User can only update their own profile

### 2. Password Hashing
- New passwords are automatically hashed with bcrypt
- Salt rounds: 10

### 3. Username Uniqueness
- System checks if new username already exists
- Prevents duplicate usernames

### 4. Sensitive Data Protection
- Password and refresh tokens excluded from response
- Only safe user data returned

---

## 💡 Usage Examples

### 1. Update Username Only
```bash
curl -X PUT http://localhost:3000/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "username": "new_username"
  }'
```

### 2. Update Email Only
```bash
curl -X PUT http://localhost:3000/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "email": "newemail@example.com"
  }'
```

### 3. Update Password Only
```bash
curl -X PUT http://localhost:3000/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "password": "newpassword123"
  }'
```

### 4. Update Multiple Fields
```bash
curl -X PUT http://localhost:3000/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "username": "john_doe_updated",
    "email": "john.updated@example.com",
    "password": "newpassword123"
  }'
```

---

## 🎯 JavaScript/TypeScript Example

### Using Fetch API
```javascript
async function updateProfile(token, profileData) {
  try {
    const response = await fetch('http://localhost:3000/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedUser = await response.json();
    console.log('Profile updated successfully:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Usage
updateProfile('your-jwt-token', {
  username: 'new_username',
  email: 'new@example.com'
});
```

### Using Axios
```javascript
import axios from 'axios';

async function updateProfile(token, profileData) {
  try {
    const response = await axios.put('http://localhost:3000/auth/profile', 
      profileData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Profile updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response?.data);
    throw error;
  }
}
```

---

## 🔄 Flow Diagram

```
User Request (PUT /auth/profile)
    ↓
JWT Authentication Middleware
    ↓
Extract User ID from Token
    ↓
Validate UpdateProfileDto
    ↓
Check if User Exists
    ↓
Validate Username Uniqueness (if updating)
    ↓
Hash Password (if updating)
    ↓
Update User in Database
    ↓
Remove Sensitive Fields
    ↓
Return Updated User Data
```

---

## 🧪 Testing in Swagger UI

1. Navigate to `http://localhost:3000/api`
2. Look for **Authentication** section
3. Find **PUT /auth/profile** endpoint
4. Click **"Authorize"** button and enter JWT token
5. Click **"Try it out"** 
6. Fill in the request body with fields to update
7. Click **"Execute"**
8. View the response

---

## 📋 Implementation Details

### Files Modified/Created:
- ✅ `src/auth/dto/update-profile.dto.ts` - New DTO
- ✅ `src/auth/auth.service.ts` - Added updateProfile method
- ✅ `src/auth/auth.controller.ts` - Added PUT /auth/profile endpoint
- ✅ Swagger documentation with full API specs

### Validation Features:
- ✅ Optional field validation
- ✅ Email format validation  
- ✅ Password minimum length validation
- ✅ Username uniqueness check
- ✅ JWT authentication requirement

### Response Features:
- ✅ Excludes sensitive fields (password, refresh token)
- ✅ Returns updated user data
- ✅ Proper error handling and messages
- ✅ HTTP status codes following REST conventions

---

*Last updated: September 18, 2025*