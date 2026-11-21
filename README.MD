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

### Authentication

Email/password sign-up and sign-in use Supabase Auth. Sessions are stored in AsyncStorage, so users stay signed in after the app restarts. On launch, the app checks for a saved session and shows a loading screen while it restores it.

### Tables

| Table | Columns | Used on |
| --- | --- | --- |
| `instruments` | `id`, `name` | Sign-up screen (public) |
| `profile` | `id` (uuid, matches the user's Auth UUID), `email`, `display_name`, `favourite_instrument` | Home and Profile screens (protected) |

### Row Level Security

RLS is enabled on both tables.

- **`instruments`:** public SELECT access, so the list appears on the sign-up screen before anyone signs in.
- **`profile`:** one SELECT policy for the `authenticated` role:
  ```sql
  (select auth.uid()) = id
  ```
  Each signed-in user can read **only their own row**. Signed-out users cannot read anything.

### What this means in the app

- The **Home** screen shows the `profile` table in a list. Because of the RLS policy, the list only ever contains **one entry: the signed-in user's own row**. This is intentional. The table holds rows for several users, but RLS hides every row except the current user's.
- The **Profile** screen shows the signed-in user's display name and favourite instrument from the same row.
- `profile` rows are created manually in the Supabase dashboard, using the user's Auth UUID as the `id`. A brand-new account created through the sign-up screen will be able to sign in, but it will see an empty Home list and a "No profile found" message on the Profile screen until a matching row is added.

## Test Account

A test account with a matching `profile` row has been set up for the instructor. The email, password, and `.env.local` values will be sent separately and are not committed to GitHub.

