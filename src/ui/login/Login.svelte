<script lang="ts">
  import { authClient, authError } from '../../utils/auth';
  import { confirmAlert } from '../../utils/data';
  import Button from '../components/Button.svelte';
  import Checkbox from '../components/Checkbox.svelte';
  import Input from '../components/Input.svelte';
  import LoadingWrapper from '../components/LoadingWrapper.svelte';

  let email = '';
  let password = '';
  let remember = true;
  let loading = false;

  $: emailValid = email.length > 3 && email.includes('@');

  function onSubmit() {
    if (emailValid && !!password) {
      loading = true;
      authClient.logIn(email, password, remember).then(() => {
        loading = false;
      });
    } else {
      authError.set(
        `Please enter a ${!emailValid ? 'valid email address' : 'password'}.`
      );
    }
  }

  function sendPasswordRecovery() {
    if (emailValid) {
      confirmAlert.set({
        message: `Send password recovery email to: ${email}?`,
        onConfirm: () => authClient.requestPasswordRecovery(email),
      });
    } else {
      authError.set('Please enter a valid email address.');
    }
  }
</script>

<style>
  main {
    padding: 2rem 1.5rem;
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  p {
    margin: 0 0 1.5rem;
  }

  form {
    max-width: 100%;
    width: 27rem;
  }

  .button-container {
    padding-top: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .forgot-container {
    margin: 0.5rem 0;
    padding: 0.5rem;
    text-align: center;
  }

  @media (min-width: 768px) {
    .button-container {
      margin-left: 7rem;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .forgot-container {
      margin: 0 0 0 1rem;
    }
  }

  a {
    display: inline-block;
    margin-top: 4rem;
    color: var(--highlight-color);
    font-weight: 500;
    text-decoration: none;
  }

  a:hover,
  a:focus,
  a:active {
    text-decoration: underline;
  }
</style>

<main>
  <p>Please log in to access the admin content.</p>
  <form on:submit|preventDefault={onSubmit}>
    <LoadingWrapper {loading}>
      <Input
        id="email"
        name="username"
        label="Email"
        type="email"
        autocomplete="username"
        bind:value={email}
        errorMessage={!!email && !emailValid ? 'Invalid email address.' : undefined} />
      <Input
        id="password"
        name="password"
        label="Password"
        type="password"
        autocomplete="current-password"
        bind:value={password} />
      <Checkbox label="Remember me" bind:checked={remember} />
      <div class="button-container">
        <Button type="submit" disabled={loading} grow={true}>Log in</Button>
        <div class="forgot-container">
          <Button styleType="light" onClick={sendPasswordRecovery}>
            Forgot password?
          </Button>
        </div>
      </div>
    </LoadingWrapper>
  </form>
  <a href="/">Return home</a>
</main>
