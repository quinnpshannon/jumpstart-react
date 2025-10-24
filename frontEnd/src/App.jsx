import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CardCard from './components/CardCard'
import './App.css'
const cards = [
  {src: "https://cards.scryfall.io/large/front/7/6/76c3cad2-1e25-4abe-878d-9194de6fcc27.jpg",
    title: "Guide of Souls",
    value: 1
  },
  {src: "https://cards.scryfall.io/large/front/c/4/c44f81ca-f72f-445c-8901-3a894a2a47f9.jpg",
  title: "Mountain",
  value: 0},
  {src: "https://cards.scryfall.io/large/front/a/2/a2e22347-f0cb-4cfd-88a3-4f46a16e4946.jpg",
  title: "Island",
  value: 0
  }
]

function App() {
  // console.log(getCards())
  return (
    <>
    <h1>CoolCards</h1>
    {cards.map((card) => <CardCard src={card.src} title={card.title} value = {card.value}/>)}
    </>
  )
}

export default App
