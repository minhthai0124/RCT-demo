import React from 'react'
import {  Route, Switch } from 'react-router-dom'

import { LiveRoom, TopPage } from '../pages'

import './App.css'

const routes = (
  <>
    <Switch>
      <Route exact path="/" component={TopPage}/>
      <Route exact path="/live/:uuid/:role" component={LiveRoom}/>
    </Switch>
  </>
)

export default routes
