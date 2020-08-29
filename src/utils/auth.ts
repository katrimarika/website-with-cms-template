import GoTrue, { UserData } from 'gotrue-js';
import qs from 'qs';
import { writable } from 'svelte/store';

export type User = UserData;
type SpecialToken = {
  type: 'invite' | 'recovery';
  token: string;
};

export const specialToken = writable<SpecialToken>(null);
export const authError = writable('');

const initAuthClient = () => {
  const auth = new GoTrue({
    APIUrl: `https://${process.env.DOMAIN_NAME}/.netlify/identity`,
    audience: '',
    setCookie: true,
  });

  // Parse possible tokens in hash on init
  const { invite_token, confirmation_token, recovery_token } = qs.parse(
    window.location.hash.replace(/^#/, '')
  );

  if (invite_token && typeof invite_token === 'string') {
    specialToken.set({ type: 'invite', token: invite_token });
  } else if (recovery_token && typeof recovery_token === 'string') {
    specialToken.set({ type: 'recovery', token: recovery_token });
  }

  window.location.hash = '';

  function setError(e: any) {
    const codeStr = e && e.status ? ` (${e.status})` : '';
    if (e && e.json && e.json.error_description) {
      authError.set(`${e.json.error_description}${codeStr}`);
    } else if (e && e.json && e.json.msg) {
      authError.set(`${e.json.msg}${codeStr}`);
    } else {
      authError.set(JSON.stringify(e, null, 2));
    }
  }

  async function signUp(token: string, password: string) {
    return auth
      .acceptInvite(token, password, false)
      .then((u) => {
        specialToken.set(null);
        user.set(u);
      })
      .catch(setError);
  }

  async function logIn(email: string, password: string, remember: boolean) {
    return auth
      .login(email, password, remember)
      .then((u) => user.set(u))
      .catch(setError);
  }

  function getUser(): User | null {
    return auth.currentUser();
  }

  async function logOut() {
    const u = auth.currentUser();
    if (!u) {
      user.set(null);
      return;
    }
    return u
      .logout()
      .then(() => user.set(null))
      .catch(setError);
  }

  async function changeLoginDetails(
    email: string,
    password: string,
    data: { full_name?: string; access_key?: string }
  ) {
    const u = auth.currentUser();
    if (!u) {
      authError.set('No user found! Please log in again.');
    }
    return u
      .update({ email, password, data })
      .then((u) => {
        user.set(u);
      })
      .catch(setError);
  }

  async function requestPasswordRecovery(email: string) {
    return auth.requestPasswordRecovery(email).catch(setError);
  }

  async function initRecoverPassword(token: string) {
    return auth
      .recover(token, false)
      .then((u) => user.set(u))
      .catch(
        () => null // fail silently
      );
  }

  async function recoverPassword(token: string, password: string) {
    return auth
      .recover(token, false)
      .then((u) => {
        return u.update({ email: u.email, password }).then((u) => {
          specialToken.set(null);
          user.set(u);
        });
      })
      .catch(setError);
  }

  function getAccessKey(): string {
    const u = getUser();
    return (u && u.user_metadata && u.user_metadata.access_key) || '';
  }

  return {
    signUp,
    logIn,
    logOut,
    getUser,
    changeLoginDetails,
    requestPasswordRecovery,
    initRecoverPassword,
    recoverPassword,
    getAccessKey,
  };
};

export const authClient = initAuthClient();

export const user = writable<User | null>(authClient.getUser());
