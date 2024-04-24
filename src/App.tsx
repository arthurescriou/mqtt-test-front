import { useState, useRef } from 'react'
import './App.css'
import mqtt from 'mqtt'

function App() {
  const [address, setAddress] = useState('ws://localhost:1883')
  const [topic, setTopic] = useState('topic')
  const [product, setProduct] = useState(0)
  const [stock, setStock] = useState(1)
  const client = useRef<mqtt.MqttClient | null>(null)

  const createMessage = () =>
    JSON.stringify({
      id: product,
      amount: Math.abs(stock),
      type: stock > 0 ? 'IN' : 'OUT',
    })

  const send = () => {
    if (client.current) {
      client.current?.end()
    }
    client.current = mqtt.connect(address)
    client.current?.on('connect', err => {
      if (err) console.error(err)
      console.log('connected to ', address)
      console.log('topic: ', topic)
      console.log(client.current?.publish(topic, createMessage()))
    })
  }

  return (
    <div className="app">
      <div className="section">
        <h3>Configuration</h3>
        <input onChange={e => setAddress(e.target.value)} value={address} />
        <input onChange={e => setTopic(e.target.value)} value={topic} />
      </div>
      <div className="section">
        <h3>Message</h3>
        <label>Product ID: </label>
        <input
          id="product"
          type="number"
          onChange={e => setProduct(parseInt(e.target.value))}
          value={product}
        />
        <label>Stock amount: </label>
        <input
          id="stock"
          type="number"
          onChange={e => setStock(parseInt(e.target.value))}
          value={stock}
        />
        <div className="button" onClick={send}>
          Send
        </div>
      </div>
    </div>
  )
}

export default App
