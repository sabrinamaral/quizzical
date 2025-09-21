import { useState } from "react";
import Questions from "./Questions";
import Start from "./Start";

export default function App() {
  const [start, setStart] = useState(false);
  function handleStart() {
    setStart(true);
  }
  return (
    <main>
      <div className="upper-geometric-shape"></div>
      <div className="lower-geometric-shape"></div>
      {start ? <Questions /> : <Start handleStart={handleStart} />}
    </main>
  );
}
