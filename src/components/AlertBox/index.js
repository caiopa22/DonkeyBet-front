import { useEffect } from "react"
import "./AlertBox.css"

export default function AlertBox({ alertMessage, isAnError, showAlertBox, setShowAlertBox }) {

    useEffect(() => {

        setTimeout(() => {
            setShowAlertBox(false)
            console.log(showAlertBox)
        }, 5000);
    }, [showAlertBox])

    if (showAlertBox) {
        return (
            <div
                className="alert-box-container"
                style={{
                    backgroundColor: isAnError ? '#F12C4C' : 'green',
                }}
            >
                <img src="imgs/alert_icon.png" />
                <p>{alertMessage}</p>
            </div>
        )
    } else {
        return null
    }
}