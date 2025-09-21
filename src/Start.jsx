export default function Start(props) {
  return (
    <section className="start">
      <h1>Quizzical</h1>
      <p>Quiz Hard or Go Home.</p>
      <button onClick={props.handleStart}>Start quiz</button>
    </section>
  );
}
