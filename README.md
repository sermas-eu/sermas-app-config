# SERMAS app configuration wizard

A wizard that creates a SERMAS application, and an example of using the SERMAS API.
It has two parts: the UI (this directory, React/Vite) and a small server
(`server/`, Express) that turns the wizard's configuration into an app and creates
it through `@sermas/api-client`.

**A SERMAS user account is required.** The wizard asks for the user's SERMAS
username and password, passes the login to the SERMAS API (`POST /api/login` on the
wizard server), and creates the app with that user's token: the user becomes the
app's owner. The wizard server has no account of its own and stores no credentials
or tokens; the browser keeps the access token for the tab only.

Run it against a SERMAS API:

```sh
# server, on :8083; SERMAS_URL is the only SERMAS setting (see server/.env.example)
cd server && npm ci && SERMAS_URL=http://localhost:8080 PORT=8083 npm run dev
# UI, on :8082; /api is proxied to the server
npm ci && npm run dev
```

## Lovable project

## Project info

**URL**: https://lovable.dev/projects/2db5680c-3521-4183-be75-88ec2a0be967

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2db5680c-3521-4183-be75-88ec2a0be967) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2db5680c-3521-4183-be75-88ec2a0be967) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
