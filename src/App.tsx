import { useState, useRef } from 'react'
import './App.css'
import mqtt from 'mqtt'

function App() {
  const [address, setAddress] = useState('ws://localhost:1883')
  const [topic, setTopic] = useState('topic')
  const [message, setMessage] = useState('topic')
  const client = useRef<mqtt.MqttClient | null>(null)

  const send = () => {
    if (client.current) {
      client.current?.end()
    }
    client.current = mqtt.connect(address)
    client.current?.on('connect', err => {
      if (err) console.error(err)
      console.log('connected to ', address)
      console.log('topic: ', topic)
      console.log(client.current?.publish(topic, message))
    })
  }

  return (
    <div className="app">
      <div className="section">
        <div>Configuration</div>
        <input onChange={e => setAddress(e.target.value)} value={address} />
        <input onChange={e => setTopic(e.target.value)} value={topic} />
      </div>
      <div className="section">
        <div>Message</div>
        <input onChange={e => setMessage(e.target.value)} value={message} />
        <div className="button" onClick={send}>
          Send
        </div>
      </div>
    </div>
  )
}

export default App
