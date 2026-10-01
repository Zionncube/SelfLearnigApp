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

The current version begins with an Understand Myself foundation where the learner records interests, strengths, challenges, attention, feelings, learning conditions, and a question they want to investigate. It then gives reliable principles and turns them into observation, experimentation, and reflection. The learner's private entries stay on their device using browser storage; unfinished form drafts and the current screen are also restored after refresh, and the Back button returns to the previous in-app screen. Learners can download a personal evidence report. The report compares a four-question before/after measure (understanding, self-observation, strategy experimentation, and reflection), confidence from 1 to 5, and activity counts. Retaking the after self-check starts with the learner's latest answers and updates the saved result. The experiment asks the learner to compare their usual strategy with one different strategy. This is a self-awareness and learning-support tool, not a diagnostic tool.

For a pilot across several children, do not collect names without school consent and a privacy process. The app uses an anonymous participant code: the child's name stays on the device, while the learner evidence is stored under the code. Vercel hosts the app; a database such as Supabase is needed to aggregate this data across phones.

## Connect Supabase tomorrow

1. Create a Supabase project.
2. In **SQL Editor**, run `supabase-schema.sql`.
3. In **Project Settings → API**, copy the Project URL and anon public key.
4. Open `config.js`.
5. Paste the Project URL and **anon public key** into it. Never use a service-role key in a browser app.
6. Deploy `mobile-app` to Vercel.

The app syncs the anonymous participant code, feature-use counts, language, scores, age, and learner evidence in `learner_data`. It deliberately excludes the child's name from the database. Run the updated schema so the `learner_data` JSON field exists.

## View researcher evidence

The learner sees only their own Journey chart. To see the pilot evidence as the researcher:

1. Sign in to Supabase and open **Table Editor -> `pilot_evidence`**. Each row is one anonymous participant code; no learner name is stored.
2. Open **SQL Editor** and run the updated `supabase-schema.sql` once. The `pilot_evidence_summary` view calculates the anonymous averages for the charts.
3. Run `select * from public.pilot_evidence_summary;` to see the before/after averages and participant count.
4. Use the before/after columns for chart 1. Use `experiments_count`, `reflections_count`, and the participant count for chart 2. The table can also be exported as CSV for a spreadsheet chart.

Do not create a public SELECT policy. The browser only needs anonymous INSERT access; researcher reading should happen from the authenticated Supabase dashboard.

## Private researcher board

Open `researcher.html` from the deployed `mobile-app` site. Sign in with the Supabase account that belongs to you. The board shows the aggregate before/after charts, anonymous participant rows, and a CSV download. Children should only receive the normal app link, not the researcher board link.
