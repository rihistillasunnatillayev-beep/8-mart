# GitHub Pages ga joylash yo'riqnomasi

## 🚀 1-qadam: Repository yaratish

1. GitHub.com → New repository
2. Repository nomi: `8-mart-website`
3. Public ✓
4. Add README ✓
5. Create repository

## 📦 2-qadam: Fayllarni yuklash

```bash
git init
git add .
git commit -m "8 Mart website - first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/8-mart-website.git
git push -u origin main
```

## ⚙️ 3-qadam: GitHub Pages yoqish

1. O'z repositoryingizga o'ting
2. Settings → Pages
3. Source: **Deploy from a branch**
4. Branch: **main**
5. Folder: **/ (root)**
6. **Save**

## 🌐 4-qadam: Saytni ko'rish

- 2-5 daqiqa kuting
- Sayt manzili: `https://USERNAME.github.io/8-mart-website`

## 📝 5-qadam: Gist yaratish (ixtiyoriy)

Agar barcha foydalanuvchilar uchun umumiy database kerak bo'lsa:

1. GitHub.com → Your Gists → New gist
2. Fayl nomi: `greetings.json`
3. Content: `[]`
4. Create secret gist
5. Gist ID dan olib `github-deploy.js` da `GIST_ID` ni almashtiring

## 🔧 6-qadam: Konfiguratsiya

`github-deploy.js` faylida:

```javascript
const GIST_ID = 'YOUR_GIST_ID'; // O'z GIST ID ni kiriting
```

## ✅ 7-qadam: Test qilish

1. Saytni oching
2. Tabrik yuboring
3. Sahifani qayta yuklang - tabrik ko'rinishi kerak

## 🎯 Natija

- ✅ 24/7 ishlaydi
- ✅ Bepul
- ✅ GitHub da hosting
- ✅ Barcha uchun ochiq

## 📞 Yordam

Agar muammo bo'lsa:

1. GitHub Actions loglarini tekshiring
2. Pages settings ni tekshiring
3. Fayllar to'g'ri yuklanganini tekshiring

---

🌸 **Muvaffaqiyat!**
