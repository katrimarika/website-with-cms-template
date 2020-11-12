<script lang="ts">
  import { authClient, user } from '../../utils/auth';
  import { submitAlert } from '../../utils/data';
  import { goToRoot } from '../../utils/route';
  import Breadcrumbs from '../components/Breadcrumbs.svelte';
  import Button from '../components/Button.svelte';
  import Input from '../components/Input.svelte';
  import LoadingWrapper from '../components/LoadingWrapper.svelte';
  import Title from '../components/Title.svelte';

  let email = $user ? $user.email : '';
  let password = '';
  let name =
    ($user && $user.user_metadata && $user.user_metadata.full_name) || '';
  let accessKey =
    ($user && $user.user_metadata && $user.user_metadata.access_key) || '';
  let loading = false;

  $: emailValid = email.length > 3 && email.includes('@');

  function onSubmit() {
    if (emailValid && !!password) {
      loading = true;
      authClient
        .changeLoginDetails(email, password, {
          full_name: name,
          access_key: accessKey,
        })
        .then(() => {
          loading = false;
          password = '';
          submitAlert.set('Details updated successfully!');
        });
    } else {
      submitAlert.set(
        `Please enter ${
          !emailValid
            ? 'a valid email address'
            : 'either your current password or a new one'
        }.`
      );
    }
  }

  function reset() {
    email = $user ? $user.email : '';
    password = '';
    name =
      ($user && $user.user_metadata && $user.user_metadata.full_name) || '';
    accessKey =
      ($user && $user.user_metadata && $user.user_metadata.access_key) || '';
  }
</script>

<style>
  p {
    margin: 0 0 1.5rem;
  }

  .buttons-container {
    padding-top: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
  }

  .cancel-container {
    margin: 0 0 0 1rem;
    padding: 0.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .reset-container {
    padding: 2.5rem 0 1rem;
    justify-content: center;
  }

  @media (min-width: 768px) {
    .buttons-container {
      margin-left: 7rem;
      max-width: 20rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .button-container {
      flex: 1 1 auto;
    }

    .reset-container {
      padding: 0.5rem 0;
      justify-content: flex-end;
    }
  }
</style>

<Breadcrumbs path="Account" />
<Title>Account</Title>
<p>Edit your details and enter a password to submit.</p>
<form on:submit|preventDefault={onSubmit} novalidate>
  <LoadingWrapper {loading}>
    <Input id="name" label="Name" bind:value={name} />
    <Input
      id="accesskey"
      label="Access key"
      type="password"
      bind:value={accessKey} />
    <Input
      id="email"
      name="username"
      label="Email"
      required={true}
      type="email"
      autocomplete="username"
      bind:value={email}
      errorMessage={!!email && !emailValid ? 'Invalid email address.' : undefined} />
    <Input
      id="password"
      name="password"
      label="Password"
      required={true}
      type="password"
      autocomplete="current-password"
      bind:value={password} />
    <div class="buttons-container">
      <div class="button-container">
        <Button type="submit" disabled={loading} grow={true}>Submit</Button>
        <div class="cancel-container">
          <Button styleType="light" onClick={goToRoot}>Cancel</Button>
        </div>
      </div>
      <div class="button-container reset-container">
        <Button styleType="danger" onClick={reset}>Reset</Button>
      </div>
    </div>
  </LoadingWrapper>
</form>
