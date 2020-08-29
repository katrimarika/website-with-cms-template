<script lang="ts">
  import { authClient } from '../../utils/auth';
  import { goToRoot } from '../../utils/route';
  import Button from '../components/Button.svelte';
  import LoadingWrapper from '../components/LoadingWrapper.svelte';

  let loading = false;

  function logOut() {
    loading = true;
    authClient.logOut().then(() => {
      goToRoot();
      loading = false;
    });
  }
</script>

<style>
  header {
    border-bottom: 2px solid var(--border-color);
    color: var(--highlight-color);
  }

  .container {
    width: 100%;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  h1 {
    font-family: var(--title-font-family);
    font-style: normal;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1.15;
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
    display: inline-block;
  }

  span {
    font-size: 1.125rem;
    color: var(--main-color);
  }

  .button-container {
    margin-left: 1rem;
  }
</style>

<header>
  <div class="container">
    <h1>
      <a href="/">Example</a>
      <!-- prettier-ignore -->
      <a href="/admin/"><span>Admin</span></a>
    </h1>
    <div class="button-container">
      <LoadingWrapper small={true} {loading}>
        <Button
          styleType="light"
          icon="exit_right"
          onClick={logOut}
          disabled={loading}>
          Log out
        </Button>
      </LoadingWrapper>
    </div>
  </div>
</header>
