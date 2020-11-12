# Website with CMS (template)

A template project for a static website with an admin page for content management. Frontend only, no own server required, but requires the project to live in GitHub and deploying in Netlify. [Netlify Identity](https://docs.netlify.com/visitor-access/identity/) is used for admin user authentication and storing github access tokens for the admin users.

The site is built with [Hugo](https://gohugo.io/) and the admin management UI with [Svelte](https://svelte.dev/). Uses icons from [System UIcons](https://systemuicons.com/).

[Admin UI demo](https://website-with-cms-demo.netlify.app/admin/)

## Usage

1. Create your own repository with this project as a template by clicking `Use this template` button in the top part of this page.
1. Get the content of the repository you just created to your own machine with `git clone git@github.com:<your-repo>.git`.
1. Set suitable values in `package.json` for name, version, license, description and so on. To automatically update the values also in package-lock.json, run `npm install`. Remember to commit your changes.
1. Create a separate branch for production (e.g. "production") to better control what gets published for everyone to see. Make sure the local branch is set to track the origin. Also, make sure the branch names in the release script `scripts/release` match yours.
1. Create a [GitHub personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) to be able to edit the repository content via this project's admin page. Give it permission to access and edit repositories (permission "repo"). Store the value securely for later use.
1. Set up the project in Netlify
   1. Sign in or sign up to the [Netlify management](https://app.netlify.com/).
   1. Select `New site from Git` and follow the instructions to set up, selecting your production branch (e.g. `production`) as the branch to deploy, setting `npm run build` as the build command and `build` as the publish directory.
   1. Configure [your domain](https://docs.netlify.com/domains-https/custom-domains/#definitions). Or if you are not using a custom domain, you can change the name of the netlify app to produce a nicer url in `Settings` -> `General` -> `Site details` -> `Site information` -> `Site name` and take note of the domain displayed at the top of the page.
   1. Set environment variables in `Site settings` -> `Build & Deploy` -> `Environment` similarly to those in `.env.sample` but with production values. Note that the `GITHUB_PROD_BRANCH` needs to be the branch you set as deploy branch in Netlify in the previous step and the `DOMAIN_NAME` match the domain displayed in Netlify.
   1. [Enable Identity](https://docs.netlify.com/visitor-access/identity/#enable-identity-in-the-ui) under the `Identity`.
   1. Set Identity user registration to invite-only via `Settings and usage` -> `Identity` -> `Registration preferences`.
   1. To include correct urls in the login-related emails, use the email templates provided in this repository. Set custom email templates in Netlify `Settings` -> `Identity` -> `Emails`. Enter the paths to the email templates (and subjects of your choice):
      - Invitation: `/admin/email-templates/invitation.html`
      - Confirmation: `/admin/email-templates/confirmation.html`
      - Password recovery: `/admin/email-templates/password-recovery.html`
      - Email-change: `/admin/email-templates/email-change.html`
1. To take into use the environment variables set for the Netlify app, do a first release of your project by running the script `./scripts/release` on your computer in a bash terminal. The script will prompt needed values. Wait for the deploy to finish: you can track the deploy in the `Deploys` tab in Netlify.
1. Send an invitation to yourself from the Netlify `Identity` tab to be able to create an admin account.
1. Sign up as an admin by finding the invitation in your email and clicking the link provided. After signing up, go to `Account` in your admin page and input the personal access token generated earlier. Then, reload the page to make new requests with the token set (you will need to sign in again, but there you can set the browser to remember you).
1. Now you can start adding content via the admin UI. Note that it does not (yet) support adding sections to your page: you will need to add new sections in local development as they also require setting up correct files in your hugo theme.
1. For local development, create development branches for "master" and "production", e.g. `dev-content`, `dev-live` and set up environment variables: make a copy of `.env.sample` as `.env` and set the variables to match your project's development values.
1. Develop your project further using the development instructions below. E.g.
   - Create sections and other content layouts for your site following [hugo documentation](https://gohugo.io/documentation/), e.g. set up your own theme in `site/themes/<my-theme>` (if you use a theme with a different name or change the name, remember to change the name in environment variables too)
   - Set your own color scheme and fonts for admin-side by editing css variable values in `src/ui/App.svelte` under `:root`
   - Customize the admin emails in `src/email-templates`
   - Edit your README to match your project

## Development

Local development instructions are for macOS and expect you to have homebrew and NodeJS.

If you don't have Hugo installed yet, install it with `brew install hugo`.

Install dependencies:

```
npm install
```

To run a local development server:

```
npm start
```

This runs a hugo development server serving files from `build` and sets up live reload for both hugo and svelte. The admin panel built from `src` folder and can be found at [/admin/](http://localhost:1313/admin/).

To release, i.e. update version, tag and push to production branch (no local build required):

```
./scripts/release
```

### Additional commands

You can add new content files with (it will prompt the needed info):

```
npm run add-content
```

To test the production build locally:

```
npm run build
```

## Notes

There are some issues with live reloading the svelte-side. It doesn't always load the content without manually refreshing the page.
