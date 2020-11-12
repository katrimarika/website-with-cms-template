<script lang="ts">
  import { onMount } from 'svelte';
  import { authClient, authError, specialToken, user } from '../../utils/auth';
  import Button from '../components/Button.svelte';
  import Input from '../components/Input.svelte';
  import LoadingWrapper from '../components/LoadingWrapper.svelte';

  let password1 = '';
  let password2 = '';
  let loading = false;

  $: invalid = password1.length < 12;
  $: noMatch = password1 !== password2;
  $: inviteType = $specialToken && $specialToken.type === 'invite';

  function onSubmit() {
    if (!invalid && !noMatch && $specialToken) {
      loading = true;
      if (inviteType) {
        authClient.signUp($specialToken.token, password1).then(() => {
          loading = false;
        });
      } else {
        authClient.recoverPassword($specialToken.token, password1).then(() => {
          loading = false;
        });
      }
    } else {
      authError.set(
        `Please enter ${
          invalid
            ? 'a password of at least 12 characters'
            : 'matching passwords'
        }.`
      );
    }
  }

  onMount(() => {
    if ($specialToken && $specialToken.type === 'recovery') {
      authClient.initRecoverPassword($specialToken.token);
    }
  });
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
  }

  @media (min-width: 768px) {
    .button-container {
      margin-left: 7rem;
      margin-right: 7rem;
    }
  }

  a {
    display: inline-block;
    margin-top: 4rem;
    color: var(--highlight-color);
    font-weight: 500;
    text-decoration: none;
  }
  a + a {
    margin-top: 2rem;
  }
</style>

<main>
  <p>
    {inviteType ? 'Please create a password to finish signing up.' : 'Please create a new password.'}
  </p>
  <form on:submit|preventDefault={onSubmit}>
    <LoadingWrapper {loading}>
      {#if !!$user}
        <Input
          id="email"
          name="username"
          label="Email"
          type="email"
          autocomplete="username"
          value={$user.email}
          disabled={true} />
      {/if}
      <Input
        id="password1"
        name="new-password"
        label="New password"
        type="password"
        autocomplete="new-password"
        bind:value={password1}
        errorMessage={!!password1 && invalid ? 'Minimum length of 12 not satisfied.' : undefined} />
      <Input
        id="password2"
        name="confirm-password"
        label="Confirm password"
        type="password"
        autocomplete="new-password"
        bind:value={password2}
        errorMessage={!!password2 && noMatch ? 'The passwords need to match.' : undefined} />
      <div class="button-container">
        <Button type="submit" disabled={loading} grow={true}>
          {inviteType ? 'Sign up' : 'Confirm'}
        </Button>
      </div>
    </LoadingWrapper>
  </form>
  <a href="/admin/">Go to login</a>
  <a href="/">Return home</a>
</main>
