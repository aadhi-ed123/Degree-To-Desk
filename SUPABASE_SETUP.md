Quick Supabase setup for Degree To Desk ✅

1) Open Supabase dashboard → Select your project → SQL Editor
2) Copy the contents of `supabase/setup.sql` (in your project) and paste it into the SQL editor, then click Run.

What the script does:
- Creates `profiles`, `jobs`, and `applications` tables
- Adds helpful indexes
- Creates `vw_applications_details` view
- Enables Row Level Security and adds recommended policies

Testing after running SQL
- In the Table Editor, confirm `profiles`, `jobs`, `applications` and view `vw_applications_details` exist.
- From your frontend app (running locally): sign up, log in, then apply for a job. Verify a row appears in `applications` and that `user_id` is the authenticated user's id.

If you enable RLS (we do in the SQL), make sure your client inserts include `user_id` matching the authenticated `auth` user id. The app's `handleApplication` has been wired to use `supabase.auth.getUser()` when syncing.

Troubleshooting
- If inserts fail with permission errors, double-check the RLS policies or temporarily disable RLS while debugging.
- Use Browser DevTools console to run quick checks:
  - await supabase.auth.getSession()
  - await supabase.from('applications').select('*')

Need me to:
- Walk you through running the SQL in the dashboard step-by-step (I can guide), or
- If you prefer, paste the SQL directly into the dashboard now (you can paste it there or give the results to me to review).

Security note: Do not share your service_role key in the client. The ANON key in `index.html` is fine for client usage.
