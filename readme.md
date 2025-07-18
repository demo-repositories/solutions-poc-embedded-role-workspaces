# Role-based workspaces using embedded Sanity Studio

In order to show or hide workspaces based on a user's role, you must know who the user is. In the default Sanity Studio configuration, this is not possible, because the configuration is built before the Studio is loaded and the user is authenticated.

However, when you embed `<Studio/>` in a React application, you can more granularly control the configuration based on the user. This example is a `React` application using `Vite`. See `src/App.tsx` for the complete code.