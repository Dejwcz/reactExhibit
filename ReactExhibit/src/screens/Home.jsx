import TransitionWrapper from "../components/TransitionWrapper";

const Home = () => {
  return (
    <TransitionWrapper>
      <div className="container">
        <h1 className="text-center m-2 fw-bold mb-3 bg-primary text-white p-2 rounded-3">
          React Showcase
        </h1>
        <p className="fs-5 col-10 mx-auto">
          This is a sample project built using React and Vite and Bootstrap.
          This project demonstrates various features and components, including
          animations, page transitions, and more.
        </p>
      </div>
    </TransitionWrapper>
  );
};

export default Home;
