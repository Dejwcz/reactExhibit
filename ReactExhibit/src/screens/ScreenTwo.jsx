import TransitionWrapper from "../components/TransitionWrapper";
import AwesomeBox from "../components/Animation/AwesomeBox";

const ScreenTwo = () => {
  return (
    <TransitionWrapper>
      <div className="container text-center">
        <h1>Animation</h1>
        <AwesomeBox />
      </div>
    </TransitionWrapper>
  );
};

export default ScreenTwo;
