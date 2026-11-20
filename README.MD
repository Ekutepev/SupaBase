# CaddyUp — Supabase Authentication

CaddyUp is an Expo React Native app that uses Supabase Auth for account registration, sign-in, sign-out, and protected screens. Forms use React Hook Form and Zod validation.

## Setup

1. Clone the repository and open the project folder.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the project root and add your Supabase project values:
   ```dotenv
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_KEY=your_supabase_publishable_or_anon_key
   ```
   Get these values from the Supabase project dashboard. The team will provide the environment values to the instructor separately. Do not commit `.env.local`, the project URL, or the key to GitHub. The project `.gitignore` must exclude environment files.
4. Start Expo:
   ```bash
   npx expo start
   ```
5. Open the app using Expo Go or an available simulator.

## Supabase Setup

- **Authentication:** Email/password sign-up and sign-in through Supabase Auth. The app keeps sessions in AsyncStorage so users can remain signed in when the app restarts.
- **Public data:** The `instruments` table is read on the sign-up screen. Its RLS policy should permit public SELECT access.
- **Protected data:** The `profile` table is read after sign-in. RLS must be enabled with an authenticated-user SELECT policy. The app expects `id` and `email` for the Home list, plus `display_name` and `favourite_instrument` for the individual Profile page. The profile ID must match the signed-in user's Auth UUID for that page to find a row.
- **Sample data:** Add at least 3–4 rows as required by the assignment and verify the RLS policies in the Supabase dashboard.


## Test Accounts

The email and password will be sent to the instructor separately, not committed to GitHub.

