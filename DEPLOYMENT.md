# 🚀 VERCEL DEPLOYMENT GUIDE - JASMANI TRACKER

**Timeline:** Early day after tomorrow ✅  
**Difficulty:** Mudah (copy-paste 3 kali)  
**Duration:** ~15 menit

---

## **CHECKLIST DEPLOYMENT**

- [ ] Step 1: Vercel Account Created
- [ ] Step 2: GitHub Connected
- [ ] Step 3: Vercel Postgres Database Created
- [ ] Step 4: Environment Variables Set
- [ ] Step 5: Project Deployed
- [ ] Step 6: Live Testing Done

---

## **STEP 1️⃣: CREATE VERCEL ACCOUNT** (5 min)

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easiest)
4. Authorize Vercel to access your GitHub
5. ✅ Done! You now have a Vercel account

---

## **STEP 2️⃣: CONNECT YOUR GITHUB REPO** (3 min)

1. After login, go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Click **"Add New..."** → **"Project"**
3. Under "Import Git Repository", search for:
   ```
   AJIKS_AKADEMI_JASMANI-TRACKERR
   ```
4. Click **"Import"**
5. ✅ Vercel will show your project details

---

## **STEP 3️⃣: CREATE VERCEL POSTGRES DATABASE** (5 min)

1. In the same Vercel dashboard, click **"Storage"** (top menu)
2. Click **"Create"** → **"Postgres"**
3. Choose region closest to you (e.g., Singapore)
4. Click **"Create"**
5. Wait 30 seconds... ✅ Database created!
6. Click on the database
7. Copy the **".env.local"** section (you'll see a copy button)
8. Keep this tab **OPEN** (we'll use it next)

---

## **STEP 4️⃣: SET ENVIRONMENT VARIABLES** (2 min)

Back in the Vercel dashboard:

1. Click on your project: **AJIKS_AKADEMI_JASMANI-TRACKERR**
2. Go to **"Settings"** → **"Environment Variables"**
3. Add these variables (copy-paste from Step 3):

### **Variable 1: DATABASE_URL**
- **Name:** `DATABASE_URL`
- **Value:** Paste from Postgres connection string you copied
- Click **"Add"**

### **Variable 2: JWT_SECRET**
- **Name:** `JWT_SECRET`
- **Value:** Generate a random string. Paste this into your terminal:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Then copy the output and paste here
- Click **"Add"**

### **Variable 3: FRONTEND_URL**
- **Name:** `FRONTEND_URL`
- **Value:** `https://jasmani-tracker.vercel.app`
  (or your custom domain if you have one)
- Click **"Add"**

✅ All 3 variables added!

---

## **STEP 5️⃣: DEPLOY!** (5 min)

1. Back in project, click **"Deployments"** tab
2. You should see a deployment in progress
3. Wait for it to say **✅ "Ready"** (takes 2-3 min)
4. Click on the deployment
5. You'll see **"Visit"** button - click it!
6. ✅ Your site is now **LIVE!** 🎉

---

## **STEP 6️⃣: TEST THE APP** (5 min)

Your site is now live at: **`https://jasmani-tracker.vercel.app`**

### **Test 1: Login**
- Username: `coach`
- Password: `password`
- Should see Dashboard ✅

### **Test 2: Dashboard**
- Click on "Members" tab
- Should show empty list (database is fresh) ✅

### **Test 3: Add Member**
- Click **"+ Add Member"** button
- Fill form:
  - Name: `Budi Santoso`
  - Gender: `Laki-laki`
  - Height: `170` cm
  - Weight (awal): `65` kg
  - Weight (current): `65` kg
- Click **"Add"**
- Member should appear in list ✅

### **Test 4: Record Training Data**
- Click **"Dashboard"** tab
- Select Budi in member list
- Click **"Add Training Data"** button
- Fill sample data:
  - Run 12 min: `2800` meters
  - Fig-8 run: `20` seconds
  - Push-ups: `30` reps
  - Sit-ups: `40` reps
  - Pull-ups: `15` reps
- Click **"Submit"**
- Should see score calculated automatically ✅

---

## **🎯 YOU'RE DONE!**

Your **JASMANI TRACKER** is now live and ready to use!

### **Key Features Working:**
- ✅ User authentication (JWT)
- ✅ Member management
- ✅ Training data recording
- ✅ POLRI score calculation
- ✅ Data persistence (PostgreSQL)
- ✅ Multi-user ready

---

## **⚠️ TROUBLESHOOTING**

### **"Database connection failed"**
→ Check that `DATABASE_URL` is correctly pasted in Environment Variables

### **"Login not working"**
→ Check that `JWT_SECRET` is set (min 32 chars)

### **"Add Member button not working"**
→ Check browser console (F12) for error messages
→ Screenshot and send to support

### **"404 Not Found on /api/members"**
→ Wait 2 minutes for deployment to fully propagate
→ Hard refresh browser (Ctrl+Shift+R)

---

## **📱 NEXT STEPS (OPTIONAL)**

### **Add Your Own Users:**
You can add real coach accounts to the database. Send me a message and I can add them.

### **Add More Features:**
- PDF export of reports
- Monthly analytics
- Email notifications
- Mobile app version

### **Domain Name:**
If you want `jasmani.ajiks.edu.id` instead of `vercel.app`, let me know!

---

## **📞 SUPPORT**

If anything doesn't work:
1. Screenshot the error
2. Check your Environment Variables
3. Make sure Database is created
4. Hard refresh browser (Ctrl+Shift+R)

I'm here to help! ✅

---

**Good luck! Your app is about to make coaching easier for AJIKS Akademi!** 🏃‍♂️⚽🏆
