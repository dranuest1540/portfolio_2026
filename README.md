# Portfolio application

This project uses Express, Handlebars, Neon PostgreSQL, and Cloudinary. Neon is
PostgreSQL, so manage it with the Neon Console or a PostgreSQL client such as
pgAdmin; phpMyAdmin is for MySQL/MariaDB and cannot connect to Neon.

## Run locally

1. Install Node.js, then run `npm install`.
2. Copy `.env.example` to `.env`.
3. Fill in `DATABASE_URL` from Neon, Cloudinary credentials, `SESSION_SECRET`,
   `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. The admin password must be at least 12
   characters. Keep `.env` private.
4. Create/update the database schema and starter records:

   ```powershell
   npm run db:migrate
   npm run db:seed
   ```

   The seeder creates or updates the admin login. It adds the two experience
   records and three project records supplied for this portfolio only when
   their respective tables are empty.

   To deliberately replace all portfolio data, admin accounts, and active
   sessions with the seed data, run `npm run db:seed:reset` instead. This reset
   is transactional, but it permanently removes the existing rows if it
   succeeds. It does not remove migration history. Use it only with the
   intended database; everyone will need to sign in again.
5. Start the server:

   ```powershell
   npm run dev
   ```

   Open `http://localhost:3000`. Use `npm start` for a normal local start.

## Deploy to Vercel

The existing `vercel.json` routes requests to the Express application in
`api/index.js`. Before deploying, run the migration and seeder against the
Neon database intended for production. Then deploy with `npx vercel` and add
these environment variables in the Vercel project settings:

- `DATABASE_URL`
- `SESSION_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Set them for the relevant Vercel environments (Preview/Production) and redeploy
after changing them. Do not put database or Cloudinary secrets in source code.
