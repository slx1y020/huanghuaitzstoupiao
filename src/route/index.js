import React from 'react'
import { Route } from 'react-router-dom'
import Home from '../page/home/index'
import Success from '../page/home/success'
function RouteMap() {
  return (
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/success" component={Success} />
    </div>
  )
}
export default RouteMap