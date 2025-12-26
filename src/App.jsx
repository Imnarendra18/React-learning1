
import Greetingclass from "./first"
import './App.css'

function App() {
  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">React Learning Lab</h1>
        
        <div className="form-group">
          <label htmlFor="color-input">Pick a Color</label>
          <input id="color-input" type="color" defaultValue="#6366f1" />
        </div>

        <div className="form-group">
          <label htmlFor="date-input">Select a Date</label>
          <input id="date-input" type="date" />
        </div>

        <div className="form-group">
          <label htmlFor="file-input">Upload a File</label>
          <input id="file-input" type="file" />
        </div>

        <div className="form-group">
          <label htmlFor="range-input">Adjust Range (0-100)</label>
          <input id="range-input" type="range" min="0" max="100" defaultValue="50" />
          <output htmlFor="range-input" className="range-value">50</output>
        </div>

        <Greetingclass />
      </div>
    </div>
  )
}

export default App
