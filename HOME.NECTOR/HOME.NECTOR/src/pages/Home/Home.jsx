import HomeNav from "./HomeNav";
import HomeMain from "./HomeMain";
import "./HomeStyle.css";

const Home = () => {
  return (
    <div className="home">
      <HomeNav />
      <HomeMain />
    </div>
  );
};

export default Home;
