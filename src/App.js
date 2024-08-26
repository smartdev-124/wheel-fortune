import WheelOfFortune from './components/Wheel';
import WheelFortune from './components/WheelFortune';
// import WheelOfFortune from './components/WheelPrizes';

function App() {
  const segments = ["Happy", "Angry", "Sad", "Frustration", "Emptyness", "Sad", "Frustration", "Emptyness"];
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#FF9000"
  ];
  const onFinished = (winner) => {
    console.log(winner);
  };
  return (
    <div className="App">
      {/* <WheelFortune /> */}
      <WheelOfFortune />
      {/* <WheelPrizes /> */}
      {/* <WheelComponent
        segments={segments}
        segColors={segColors}
        winningSegment=""
        onFinished={(winner) => onFinished(winner)}
        primaryColor="black"
        primaryColoraround="#ffffffb4"
        contrastColor="white"
        buttonText="Spin"
        isOnlyOnce={false}
        size={190}
      /> */}
      {/* <WheelFortuneGSAP /> */}
    </div>
  );
}

export default App;
