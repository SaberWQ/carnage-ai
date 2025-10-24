# 📖 Carnage AI - Детальна Інструкція Встановлення

## 🎯 Передумови

Перед початком переконайтеся, що у вас встановлено:

- **Python 3.11+** ([завантажити](https://www.python.org/downloads/))
- **Node.js 18+** ([завантажити](https://nodejs.org/))
- **PostgreSQL 13+** ([завантажити](https://www.postgresql.org/download/))
- **Git** ([завантажити](https://git-scm.com/downloads))
- **Docker** (опціонально, [завантажити](https://www.docker.com/))

## 🚀 Метод 1: Docker (Найпростіший)

### Крок 1: Клонування репозиторію

\`\`\`bash
git clone https://github.com/SaberQW/carnage-ai.git
cd carnage-ai
\`\`\`

### Крок 2: Створення .env файлу

\`\`\`bash
cp .env.example .env
\`\`\`

Відредагуйте `.env` файл за потреби.

### Крок 3: Запуск Docker Compose

\`\`\`bash
# Збірка та запуск всіх сервісів
docker-compose up -d

# Перевірка статусу
docker-compose ps
\`\`\`

### Крок 4: Створення суперкористувача

\`\`\`bash
docker-compose exec django python manage.py createsuperuser
\`\`\`

### Крок 5: Доступ до додатку

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:10000/api
- **Admin Panel**: http://localhost:10000/admin

### Зупинка сервісів

\`\`\`bash
docker-compose down
\`\`\`

## 🔧 Метод 2: Ручне Встановлення

### A. Backend (Django)

#### Крок 1: Встановлення Python залежностей

\`\`\`bash
cd backend

# Створення віртуального середовища
python -m venv venv

# Активація (Linux/Mac)
source venv/bin/activate

# Активація (Windows)
venv\Scripts\activate

# Встановлення залежностей
pip install --upgrade pip
pip install -r requirements.txt
\`\`\`

#### Крок 2: Налаштування PostgreSQL

\`\`\`bash
# Увійдіть в PostgreSQL
psql -U postgres

# Створіть базу даних
CREATE DATABASE carnage_ai;
CREATE USER carnage_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE carnage_ai TO carnage_user;
\q
\`\`\`

Оновіть `backend/core/settings.py`:

\`\`\`python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'carnage_ai',
        'USER': 'carnage_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
\`\`\`

#### Крок 3: Компіляція Cython модулів

\`\`\`bash
cd ai_engine
python setup.py build_ext --inplace
cd ..
\`\`\`

#### Крок 4: Міграції бази даних

\`\`\`bash
python manage.py makemigrations
python manage.py migrate
\`\`\`

#### Крок 5: Створення суперкористувача

\`\`\`bash
python manage.py createsuperuser
\`\`\`

#### Крок 6: Запуск сервера на порті 10000

\`\`\`bash
python manage.py runserver 0.0.0.0:10000
\`\`\`

Перевірте: http://localhost:10000/admin

### B. Frontend (Next.js)

#### Крок 1: Встановлення Node.js залежностей

\`\`\`bash
cd frontend
npm install
\`\`\`

#### Крок 2: Створення .env.local

\`\`\`bash
echo "NEXT_PUBLIC_API_URL=http://localhost:10000/api" > .env.local
\`\`\`

#### Крок 3: Запуск Development сервера

\`\`\`bash
npm run dev
\`\`\`

Перевірте: http://localhost:3000

### C. Mobile (React Native) - Опціонально

\`\`\`bash
cd mobile
npm install

# Запуск Expo
npx expo start
\`\`\`

## 🧪 Тестування Встановлення

### 1. Тест Backend API

\`\`\`bash
# Реєстрація користувача
curl -X POST http://localhost:10000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Логін
curl -X POST http://localhost:10000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
\`\`\`

### 2. Тест Тренування Моделі

\`\`\`bash
# Отримайте токен з попереднього кроку
TOKEN="your_access_token"

# Тренування XOR мережі
curl -X POST http://localhost:10000/api/models/train/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "XOR Test",
    "layers": [2, 10, 2],
    "activation": "relu",
    "learning_rate": 0.01,
    "epochs": 1000,
    "X": [[0,0], [0,1], [1,0], [1,1]],
    "y": [[1,0], [0,1], [0,1], [1,0]]
  }'
\`\`\`

## 🐛 Вирішення Проблем

### Проблема: Помилка підключення до PostgreSQL

**Рішення:**
\`\`\`bash
# Перевірте статус PostgreSQL
sudo systemctl status postgresql

# Запустіть PostgreSQL
sudo systemctl start postgresql
\`\`\`

### Проблема: Cython не компілюється

**Рішення:**
\`\`\`bash
# Встановіть компілятор C
# Ubuntu/Debian
sudo apt-get install build-essential

# macOS
xcode-select --install

# Windows
# Встановіть Visual Studio Build Tools
\`\`\`

### Проблема: Порт 10000 зайнятий

**Рішення:**
\`\`\`bash
# Знайдіть процес
lsof -i :10000

# Вбийте процес
kill -9 <PID>

# Або використайте інший порт
python manage.py runserver 0.0.0.0:8000
\`\`\`

### Проблема: Frontend не підключається до Backend

**Рішення:**
1. Перевірте, що Backend запущений на порті 10000
2. Перевірте CORS налаштування в `backend/core/settings.py`
3. Перевірте `.env.local` у frontend

## 📊 Структура Проекту

\`\`\`
carnage-ai/
├── backend/
│   ├── core/                 # Django налаштування
│   │   ├── settings.py      # Головні налаштування
│   │   ├── urls.py          # URL маршрути
│   │   └── wsgi.py          # WSGI конфігурація
│   ├── ai_engine/           # Cython AI модулі
│   │   ├── neural_network.py
│   │   ├── models.py        # Django моделі
│   │   └── setup.py         # Cython збірка
│   ├── api/                 # REST API
│   │   ├── views.py         # API endpoints
│   │   ├── serializers.py   # DRF serializers
│   │   └── urls.py
│   ├── users/               # Аутентифікація
│   ├── requirements.txt     # Python залежності
│   └── manage.py
├── frontend/
│   ├── app/                 # Next.js pages
│   ├── components/          # React компоненти
│   ├── lib/                 # Утиліти
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
\`\`\`

## 🎓 Наступні Кроки

1. **Вивчіть API документацію** в README.md
2. **Створіть свою першу модель** через веб-інтерфейс
3. **Експериментуйте з різними архітектурами**
4. **Інтегруйте з мобільним додатком**

## 📞 Підтримка

Якщо виникли проблеми:
- Перевірте [GitHub Issues](https://github.com/yourusername/carnage-ai/issues)
- Напишіть на support@carnage-ai.com
- Приєднуйтесь до нашого Discord сервера

---

**Успішного тренування! 🚀**
