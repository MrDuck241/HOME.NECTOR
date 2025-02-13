import '../styles/DevicesPanelMainStyle.css'
import { useState } from 'react';

const DevicesPanelMain = () => {

    const [isDeviceSelected, setIsDeviceSelected] = useState(true);

    return (
        <div className='devicesPanelMain'>
            {
                isDeviceSelected && (
                    <>
                        <span className='deviceFullNameHolder'>Multi Sensor Deivce</span>
                        <div className='deviceParamBoxesHolder'>
                            <div className='deviceDescriptionAndButtonsHolder'>
                                <span className='descriptionHolderTitle'>Device Description</span>
                                <div className='descriptionHolder'>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                                </div>
                                <div className='descriptionButtonsHolder'>

                                </div>
                            </div>
                            <div className='deviceDataAndButtonsHolder'>

                            </div>
                        </div>
                        <div className='deviceParamBoxesHolder'></div>
                    </>
                )
            }
        </div>
    )
}

export default DevicesPanelMain;