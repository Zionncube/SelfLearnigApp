# Self-Learning Journey — mobile web app

This is the responsive phone version of the project. It is ready to deploy as a static Vercel site.

## Deploy to Vercel

1. Create a GitHub repository and upload this project.
2. Log in at Vercel and choose **Add New → Project**.
3. Import the GitHub repository.
4. Set **Root Directory** to `mobile-app`.
5. Click **Deploy**.

Vercel will give the project a public `vercel.app` link that learners can open on phones.

## Evidence data

The current version saves a learner's private entries on their own device using browser storage and allows a teacher/parent to download an evidence report.

For a pilot across several children, do not collect names or sensitive journal text unless your school has consent and a privacy process. Use anonymous participant codes and collect only the evaluation answers and feature-use counts in a shared database. Vercel hosts the app; a database such as Supabase is needed to aggregate this data across phones.

## Connect Supabase tomorrow

1. Create a Supabase project.
2. In **SQL Editor**, run `supabase-schema.sql`.
3. In **Project Settings → API**, copy the Project URL and anon public key.
4. Open `config.js`.
5. Paste the Project URL and **anon public key** into it. Never use a service-role key in a browser app.
6. Deploy `mobile-app` to Vercel.

The app will sync only anonymous participant code, feature-use counts, language, and before/after check-in scores. It deliberately does not sync names or private journal entries.
