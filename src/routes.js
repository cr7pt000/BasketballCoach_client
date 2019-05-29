import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { Router, Route, Redirect } from 'react-router-dom';

import { disconnectGame } from 'redux/modules/game/actions'

import App from './App';
import Home from 'pages/home';
import Login from 'pages/login';
import Register from 'pages/register';

import { electron, minimumSize, loginSize, normalSize } from 'my-electron';

class Routes extends Component {
 
  componentDidMount() {
    this.lastPath = '/login'
    document.body.classList.add('login')
    this.unlisten = this.props.history.listen(this.handleRouteChange)
  }

  componentWillUnmount() {
    this.unlisten && this.unlisten()
  }

  handleRouteChange = (location, a) => {
    const window = electron.remote.getCurrentWindow()

    if (location.pathname === '/login' || location.pathname === '/register') {
      if (this.lastPath !== '/login' && this.lastPath !== '/register') {
        window.setFullScreen(false)
        window.setMinimumSize(loginSize.width, loginSize.height)
        window.setMaximumSize(loginSize.width, loginSize.height)
        window.setSize(loginSize.width, loginSize.height)
        window.setMaximizable(false)
        // window.setResizable(false)
        document.body.classList.add('login')
      }
    } else if (this.lastPath === '/login' || this.lastPath === '/register') {
      window.setResizable(true)
      window.setMaximumSize(3000, 3000)
      window.setSize(normalSize.width, normalSize.height)
      window.setMaximizable(true)
      window.setMinimumSize(minimumSize.width, minimumSize.height)
      document.body.classList.remove('login')
    }
    
    this.lastPath = location.pathname
  }

  view = mode => () => <Home view={mode} />

  redirect = () => <Redirect to='/login' />

  render() {
    return (
      <Router history={this.props.history}>
        <App>
          <Route path='/dashboard' render={this.view('dashboard')} />
          <Route path='/game' exact render={this.view('game')} />
          <Route path='/game/freethrow' render={this.view('game/freethrow')} />
          <Route path='/game/drills' render={this.view('game/drills')} />
          <Route path='/statistics' render={this.view('statistics')} />
          <Route path='/history' render={this.view('history')} />
          <Route path='/leaderboard' render={this.view('leaderboard')} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/' exact render={this.redirect} />
        </App>
      </Router>
    )
  }
}

const actions = {
  disconnectGame
}

export default compose(
  connect(undefined, actions)
)(Routes)
