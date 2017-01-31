import React, { Component } from 'react';
import axios from 'axios'
import io from 'socket.io-client'
import moment from 'moment'

const port = 9001
const baseUrl = `http://localhost:${port}`

class App extends Component {
  constructor() {
    super()
    this.state = {
      messages: [],
      message: ''
    }
  }
  componentDidMount() {
    this.fetchChats()
    this.socket = io(baseUrl)
    this.socket.on('chat', this.updateChats.bind(this))
  }
  async fetchChats() {
    const {data: messages} = await axios.get(`${baseUrl}/messages`)
    this.setState({messages})
  }
  updateChats(chat) {
    this.setState({messages: this.state.messages.concat([chat])})
  }
  handleInputChange({target:{value}}) {
    this.setState({message: value})
  }
  handleSubmit(e) {
    e.preventDefault()
    this.socket.emit('chat', {message: this.state.message, userName: 'JACOB'})
    this.setState({message: ''})
  }
  renderMessages() {
    return this.state.messages.map(({message, userName, timestamp}) => {
      return (
        <div style={{display: 'flex', justifyContent: 'space-between'}} key={`${message}-${userName}-${timestamp}`}>
          <span>{moment(timestamp).fromNow()} from</span>&nbsp;
          <span>{userName}:</span>&nbsp;
          <span style={{flex: 1, textAlign: 'right'}}>{message}</span>
        </div>
      )
    })
  }
  render() {
    return (
      <div className="App" style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh'
        }}>
        <div style={{
            flex: 1
          }}>
          {this.renderMessages.call(this)}
        </div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input style={{width: '100%'}} type='text' onChange={this.handleInputChange.bind(this)} value={this.state.message}></input>
        </form>
      </div>
    );
  }
}

export default App
