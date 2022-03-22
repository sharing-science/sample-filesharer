import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import UploadFiles from './views/upload-files.component'
import LoginPage from './views/loginPage.jsx'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route path="/">
          <UploadFiles />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
