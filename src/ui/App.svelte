<script lang="ts">
  import { authError, specialToken, user } from '../utils/auth';
  import PopupAlert from './components/PopupAlert.svelte';
  import Header from './layout/Header.svelte';
  import Main from './layout/Main.svelte';
  import Login from './login/Login.svelte';
  import LoginHeader from './login/LoginHeader.svelte';
  import SignUp from './login/SignUp.svelte';
</script>

<svelte:head>
  <style>
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: url('/static/fonts/Roboto-Light.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url('/static/fonts/Roboto-Medium.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Roboto';
      font-style: italic;
      font-weight: 300;
      font-display: swap;
      src: url('/static/fonts/Roboto-LightItalic.ttf') format('truetype');
    }
    :root {
      --main-color: #000;
      --inverse-color: #fff;
      --highlight-color: #0051ad;
      --border-color: #bbb;
      --danger-color: #e60000;

      --font-family: Roboto, sans-serif;
      --title-font-family: Roboto, sans-serif;
      --code-font-family: monospace;
    }
    html {
      font-family: var(--font-family);
      font-style: normal;
      font-size: 16px;
      font-weight: 300;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: var(--main-color);
    }
    body {
      margin: 0;
      position: relative;
      background-color: var(--inverse-color);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</svelte:head>

{#if !!$specialToken}
  <LoginHeader />
  <SignUp />
{:else if !$user}
  <LoginHeader />
  <Login />
{:else}
  <Header />
  <Main />
{/if}

{#if !!$authError}
  <PopupAlert message={$authError} close={() => authError.set('')} />
{/if}
