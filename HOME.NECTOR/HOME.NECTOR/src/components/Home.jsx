import HomeNav from "./HomeNav";
import HomeMain from "./HomeMain";
import '../styles/HomeStyle.css'

const Home = () => {
    return (
        <div className="home">
            <HomeNav/>
            <HomeMain/>
        </div>
    )
}

export default Home;