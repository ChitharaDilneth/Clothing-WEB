# 🚀 Vercel Deployment & Admin Login Guide | TBH — The Brand Hub

මෙම Document එක මගින් මෙම Project එක **Vercel** වෙත පහසුවෙන්ම deploy කරගන්නා ආකාරය සහ අලුතින් සකස් කළ **Admin Login / Logout System** එක භාවිතා කරන ආකාරය පියවරෙන් පියවර විස්තර කර ඇත.

---

## 🔑 1. Admin Panel Credentials (පරිපාලක පිවිසුම)

දැන් ඔබට Username හෝ Email දෙකෙන්ම Admin Console එකට log විය හැක:

* **Admin Login URL**: `https://your-domain.vercel.app/admin/login` (හෝ Local: `http://localhost:3000/admin/login`)
* **Default Username**: `admin`
* **Default Email**: `admin@thebrandhub.lk`
* **Default Password**: `admin123456`

> **Note**: Admin login page එකෙහි පහළ ඇති **"Auto Fill"** button එක click කිරීමෙන්ද credentials auto-fill කරගෙන ඉක්මනින් login විය හැක.
> Admin Console එකේ වම් පස Sidebar එකේ හෝ ඉහළ Bar එකේ ඇති **"Sign Out"** button එක click කළ විට ආරක්ෂිතව log out වී නැවත Login page එකට redirect වේ.

---

## 🌐 2. Vercel එකට Deploy කරන සම්පූර්ණ පියවර (Step-by-Step)

### පියවර 1: Code එක GitHub වෙත Push කරන්න
ප්‍රථමයෙන් ඔබගේ project එක GitHub repository එකකට commit & push කරන්න:
```bash
git add .
git commit -m "Add admin auth system and Vercel environment setup"
git push origin main
```

### පියවර 2: Vercel වෙත Import කරන්න
1. [vercel.com](https://vercel.com) වෙත ගොස් ඔබගේ GitHub ගිණුමෙන් Sign in වන්න.
2. **"Add New..."** -> **"Project"** තෝරන්න.
3. ඔබගේ `Clothing web` (හෝ අදාළ GitHub repo එක) ඉදිරියෙන් ඇති **"Import"** button එක click කරන්න.

### පියවර 3: Environment Variables ඇතුළත් කරන්න (ඉතා වැදගත්)
Vercel එකේ **"Environment Variables"** section එක expand කර පහත සියලුම Keys සහ Values ඇතුළත් කරන්න:

| Variable Key | Value (ඔබගේ .env.local එකෙන්) | විස්තරය |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://denethc545_db_user:x3XDnuVEPkIoiYoY@cluster0.uwhf9lf.mongodb.net/meal-ordering?appName=Cluster0` | MongoDB Database Connection |
| `AUTH_SECRET` | `tbh_super_secret_jwt_key_987654321_secure_prod` | JWT Session Secret |
| `ADMIN_USERNAME` | `admin` | Admin Login Username |
| `ADMIN_PASSWORD` | `admin123456` | Admin Login Password |
| `ADMIN_EMAIL` | `admin@thebrandhub.lk` | Admin Login Email |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Vercel Deployment URL |
| `CLOUDINARY_CLOUD_NAME` | `dxdpsz2b6` | Image Uploads Cloud |
| `CLOUDINARY_API_KEY` | `792512629886883` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | `9U-jzhkDGbQheMY9B9GgQHa4sYQ` | Cloudinary Secret |
| `CLOUDINARY_UPLOAD_FOLDER` | `tbh_store` | Cloudinary Folder |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`| `dxdpsz2b6` | Public Cloudinary Name |
| `PAYMENT_PROVIDER` | `cod` | Cash On Delivery |
| `WHATSAPP_CONTACT_NUMBER` | `+94763473075` | WhatsApp Customer Care |

### පියවර 4: MongoDB Atlas Network Access පරීක්ෂා කරන්න (Crucial)
Vercel Serverless Functions මගින් Database එකට connect වීමට නම්:
1. [cloud.mongodb.com](https://cloud.mongodb.com) වෙත Login වන්න.
2. වම් පස මෙනුවේ **Security** -> **Network Access** වෙත යන්න.
3. **IP Access List** එකෙහි `0.0.0.0/0` (Allow Access from Anywhere) ඇතුළත් කර ඇති බව තහවුරු කරගන්න (Active Status).

### පියවර 5: Deploy කරන්න
* **"Deploy"** button එක click කරන්න.
* විනාඩි 1-2ක් ඇතුළත Project එක live build වී Deploy වනු ඇත!

---

## 🛡️ 3. Security Highlights
* **HTTP-Only Cookies**: Production එකේදී `secure: true` සහ `sameSite: "lax"` සහිතව cookies pass වන බැවින් XSS ප්‍රහාර වලින් ආරක්ෂිතයි.
* **Role-Based Access Control**: `/admin` මාර්ගය අනවසර පරිශීලකයින්ගෙන් ආරක්ෂා කර ඇති අතර, login නොවී direct access ලබා ගැනීමට උත්සාහ කළහොත් ස්වයංක්‍රීයව `/admin/login` වෙත redirect වේ.
* **Mongoose Connection Caching**: Vercel Serverless Environment එකට ගැලපෙන සේ database connections reuse වන පරිදි සකසා ඇත.

