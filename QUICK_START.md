# ⚡ QUICK START - JASMANI TRACKER

**Ingin deploy cepat? Ikuti ini saja:**

---

## **5 STEP DEPLOYMENT (15 menit)**

### **1. Vercel Account**
```
→ Go to vercel.com
→ Sign up with GitHub
```

### **2. Import Project**
```
Dashboard → Add New → Project
Search: AJIKS_AKADEMI_JASMANI-TRACKERR
Click Import
```

### **3. Create Database**
```
Storage → Create → Postgres
Choose region → Create
Copy .env.local (keep browser open!)
```

### **4. Set Secrets**
```
Settings → Environment Variables
Paste DATABASE_URL from Postgres
Add JWT_SECRET (run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
Add FRONTEND_URL = https://jasmani-tracker.vercel.app
```

### **5. Deploy**
```
Wait for "Ready" status ✅
Click Visit
Login: coach / password
Done! 🎉
```

---

## **DEMO DATA**

### **Login**
- Username: `coach`
- Password: `password`

### **Test Member (add via Members page)**
- Name: `Budi Santoso`
- Gender: `Laki-laki`
- Height: `170` cm
- Weight: `65` kg

### **Test Training Data**
- Run 12min: `2800` m
- Fig-8: `20` sec
- Push-ups: `30`
- Sit-ups: `40`
- Pull-ups: `15`

---

## **ENDPOINTS (For testing via Postman/cURL)**

### **Login**
```bash
POST https://jasmani-tracker.vercel.app/api/auth/login
Content-Type: application/json

{
  "username": "coach",
  "password": "password"
}

Response: { token, user }
```

### **Get Members**
```bash
GET https://jasmani-tracker.vercel.app/api/members
Authorization: Bearer {token}

Response: [{ id, name, gender, ... }]
```

### **Add Member**
```bash
POST https://jasmani-tracker.vercel.app/api/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Budi Santoso",
  "gender": "L",
  "heightCm": 170,
  "weightInitKg": 65,
  "weightCurrentKg": 65
}
```

### **Record Training**
```bash
POST https://jasmani-tracker.vercel.app/api/entries
Authorization: Bearer {token}
Content-Type: application/json

{
  "memberId": 1,
  "entryDate": "2026-04-29",
  "run12Meters": 2800,
  "fig8Seconds": 20,
  "pushupReps": 30,
  "situpReps": 40,
  "pullupReps": 15
}

Response: { score, grade, ... }
```

---

## **POLRI SCORING**

- **Grade A:** 80+
- **Grade B:** 61-79
- **Grade C:** 41-60
- **Grade D:** <41
- **TMS:** Any component <41

---

## **TROUBLESHOOTING**

| Problem | Solution |
|---------|----------|
| "Cannot connect to database" | Check DATABASE_URL in Environment Variables |
| "Login fails" | Check JWT_SECRET is set (not empty) |
| "404 on /api/members" | Wait 2min, hard refresh (Ctrl+Shift+R) |
| "Add Member button disabled" | Check browser console (F12) for errors |
| "Database tables not created" | Make one API call first - tables auto-create |

---

## **KEY FEATURES ✅**

- User authentication with JWT
- Member CRUD operations
- Training data recording
- POLRI automatic scoring
- PostgreSQL persistence
- Vercel serverless auto-scaling
- No payment needed (free tier)

---

**Ready? Start with Step 1 above!** 🚀
