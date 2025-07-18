import { Config, StudioLayout, StudioProvider, WorkspaceOptions, useClient, useCurrentUser } from 'sanity'
import './App.css'
import { deskTool } from 'sanity/desk'
import { useEffect, useState } from 'react'

// This will let you use Studio authentication to determine what workspaces to show to a user.
// You will want to style the NoAccess screen, and may want to break these out into separate files

const projectId = 'your-project-id'

const allWorkspaceConfigs: WorkspaceOptions[] = [{
  name: 'client1',
  title: 'Client 1',
  basePath: '/client1',

  projectId,
  dataset: 'client-1',

  plugins: [deskTool()],

  schema: {
    types: [],
  },
},
{
  name: 'client2',
  title: 'Client 2',
  basePath: '/client2',

  projectId,
  dataset: 'client-2',

  plugins: [deskTool()],

  schema: {
    types: [],
  },
}]

// this component is shown when the user has no access to any datasets
function NoAccess() {
  const client = useClient({apiVersion: '2023-05-17'})
  const logout = async () => {
      await client.request({
          url: '/auth/logout',
          method: 'POST'
      })
      window.location.href = "/"
  }
  return <div>You do not have any dataset access. <button onClick={logout}>Log out</button></div>
}

// this config is used when the user has no access, including before the user has logged in
// so we don't want to title the project "no access"
const noAccessConfig: Config = {
  name: 'no-access',
  title: 'Platform Name',
  projectId,
  dataset: 'no-access', // does not need to exist
}

// This component is separate so we can use Studio hooks, and pass the user metadata back up to the app
function InnerApp({ setUser, hasWorkspace }) {
  const user = useCurrentUser()

  useEffect(() => {
      setUser(user)
  }, [user, setUser])
  
  // we control the layout component here, rather than in the configuration
  return hasWorkspace ? <StudioLayout /> : <NoAccess />
}

// This is the root of the app
function App() {
  const [user, setUser] = useState()

  // assume all roles include the workspace name. I.e. client1-editor
  // you can have more specific logic here
  const allowedWorkspaces = user?.roles.map(role => role.name.split('-')[0]) || []

  const workspaceConfigs = allWorkspaceConfigs.filter(workspace => allowedWorkspaces.includes(workspace.name))

  const hasWorkspace = !!workspaceConfigs.length

  return (
    <div id="app">
      <StudioProvider
        basePath='/studio'
        // we have to have at least one configuration, so if no "real" workspaces are available, then we show the "no access" config
        config={hasWorkspace ? workspaceConfigs : noAccessConfig}
      >
        <InnerApp setUser={setUser} hasWorkspace={hasWorkspace} />
      </StudioProvider>
    </div>
  )
}

export default App
