# Website with CMS (template)

A template project for a static website with an admin page for content management. Frontend only, no own server required, but requires the project to live in GitHub and deploying in Netlify. [Netlify Identity](https://docs.netlify.com/visitor-access/identity/) is used for admin user authentication and storing github access tokens for the admin users.

The site is built with [Hugo](https://gohugo.io/) and the admin management UI with [Svelte](https://svelte.dev/). Uses icons from [System UIcons](https://systemuicons.com/).

## Usage

1. Create your own repository with this project as a template.
1. Set suitable values in `package.json` for name, version, license, description and so on.
1. Set up environment variables: make a copy of `.env.sample` as `.env` and set the variables to match your project.
1. Create branches for development and production, and for site development similar to "development" and "production" (matching the values you set in `.env`), e.g. `master`, `production`, `dev-content`, `dev-live`. Make sure the branches in the release script `scripts/release` are correct.
1. Create a [GitHub personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) to be able to edit the repository content via this projects admin page. Give it permission to access and edit repositories (`repo`). Store the value securely or later use.
1. Set up the project in Netlify
   1. Sign in or sign up to the [Netlify management](https://app.netlify.com/).
   1. Select `New site from Git` and follow the instructions to set up, selecting your production branch (e.g. `production`) as the branch to deploy, setting `npm run build` as the build command and `build` as the publish directory.
   1. Configure [your domain](https://docs.netlify.com/domains-https/custom-domains/#definitions) to match `DOMAIN_NAME` in `.env`. Or if you are not using a custom domain, you can change the name of the netlify app to produce a nicer url in `Settings` -> `General` -> `Site details` -> `Site information` -> `Site name` and set the domain from url displayed at the top of the page as your `DOMAIN_NAME`.
   1. Set environment variables in `Site settings` -> `Build & Deploy` -> `Environment` similarly to your `.env` but with production values. Note that the `GITHUB_PROD_BRANCH` needs to be the branch you set as deploy branch in Netlify in the previous step.
   1. [Enable Identity](https://docs.netlify.com/visitor-access/identity/#enable-identity-in-the-ui)) under the `Identity` tab and set it invite-only via `Settings and usage`. Send an invite to yourself.
1. Sign up as an admin by finding the invitation in your email and clicking the link provided. After signing up, go to `Account` in your admin page and input the personal access token generated earlier.
1. Now you can start adding content via the admin UI
1. Develop your project further using the development instructions below. E.g.
   - Create sections and other content layouts for your site following [hugo documentation](https://gohugo.io/documentation/), e.g. set up your own theme in `site/themes/<my-theme>` (remember to change the name in environment variables too)
   - Set your own color scheme and fonts for admin-side by editing css variable values in `src/ui/App.svelte` under `:root`
   - Customize the admin emails in `src/email-templates`

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

You can add new content files with (it will prompt the needed info):

```
npm run add-content
```

To test the production build locally:

```
npm run build
```

To release, i.e. update version, tag and push to production branch (no local build required):

```
./scripts/release
```
