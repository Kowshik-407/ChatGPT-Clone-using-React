import { useState, useEffect } from "react"

const App = () => {
  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const getMessages = async () => {
    try{
      const response = await fetch('http://localhost:8000/completions', {
        method: 'POST', 
        headers:{
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          message: value
        })
      })
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch(error){
      console.error(error)
    }
  }

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      getMessages()
    }
  }

  useEffect(() => {
    console.log(currentTitle, value, message)
    if(!currentTitle && value && message){
      setCurrentTitle(value)
    }
    if(currentTitle && value && message){
      setPreviousChats(prevChats => (
        [...prevChats, 
          {
            title: currentTitle, 
            role: "user",
            content: value
          }, 
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
  }, [message, currentTitle])

  // console.log(previousChats)

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  // console.log(uniqueTitles)

  return (
    <div className="app">
      {/* Side Bar Section */}
      <section className='side-bar'>
        <button onClick={createNewChat}>➕ New chat</button>
        <ul className='history'>
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Kowshik</p>
        </nav>
      </section>
      {/* Main Section */}
      <section className='main'>
        {!currentTitle && <h1>Kowshik LLM</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => 
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p className="content">{chatMessage.content}</p>
            </li>
          )}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown}/>
            <div id="submit" onClick={getMessages}>➤</div>
          </div>
          <p className="info">Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT May 24 Version</p>
        </div>
      </section>
    </div>
  );
}

export default App;