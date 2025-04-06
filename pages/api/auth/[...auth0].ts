import { handleAuth, handleCallback, handleLogin, handleLogout } from "@auth0/nextjs-auth0"

export default handleAuth({
  login: handleLogin({
    returnTo: "/profile",
  }),
  callback: handleCallback({
    redirectTo: "/profile",
  }),
  logout: handleLogout({
    returnTo: "/",
  }),
})

