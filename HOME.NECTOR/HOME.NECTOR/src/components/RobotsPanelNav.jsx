import { useEffect, useState } from 'react';
import '../styles/RobotsPanelNavStyle.css'

const RobotsPanelNav = ({onSelectRobot}) => {
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [fetchedRobots, setFetchedRobots] = useState(null);

    useEffect(() => {
        const backendUrl = "http://192.168.1.101:80/php/get_robots.php";
        fetch(backendUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error during loading data');
                }
                return response.json();
            })
            .then((data) => {
                setFetchedRobots(data.data);
                setLoading(false);
                console.log(data);
            })
            .catch((err) => {
                setErrorMsg("Failed to download robots from database");
                setLoading(false);
            });
    }, [])

    const onRobotDeviceClick = (element) => {
        onSelectRobot(element);
    }

    const renderRobotBox = (element, index) => {
        return (
            <button className="robotBox" key={index} onClick={() => onRobotDeviceClick(element)}>{element.ID_Name}</button>
        );
    }

    return (
        <div className="robots_panel_nav">
                <div className='robotsHolder'>
                    {loading ? (
                        <p className="text-cyan-400 text-lg italic font-semibold">Loading...</p>
                    ) : errorMsg ? (
                        <div className="text-cyan-400 text-lg italic font-semibold">{errorMsg}</div>
                    ) : (
                        fetchedRobots && fetchedRobots.length > 0 ? (
                            fetchedRobots.map((element, index) => renderRobotBox(element, index))
                        ) : (
                            <p>No robots available</p>
                        )
                    )}
                </div>
                <div className='navControlBtnsHolder'>
                    <div className='closeConnectionBtn'>
                        <span className='w-[90%] h-[auto] text-center absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4'>
                            Close Active Connection
                        </span>
                    </div>
                </div>
        </div>
    )
}

export default RobotsPanelNav;