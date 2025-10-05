## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Add a .env file in the src folder which should look like this: 

DATABASE_URL=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="YOUR_SECRET_KEY"
