import { useEffect, useState } from "react";
import "./LoginComponent.css"
import axios from "axios";
import AlertBox from "../AlertBox";

export default function LoginComponent({ openLoginComponent, setOpenLoginComponent, setProfile, setIsLogged }) {

    // Alertbox usestates
    const [showAlertBox, setShowAlertBox] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [isAnError, setIsAnError] = useState(false)

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    function requestLogin() {

        const verifyLogin = (data) => {
            let error = false;

            if (data.email === '') {
            setIsAnError(true);
                setAlertMessage("E-mail não pode ser vazio")
                setShowAlertBox(true)
                error = true;
            }

            if (data.password === '') {
                setIsAnError(true);
                setAlertMessage("Senha não pode ser vazia")
                setShowAlertBox(true)
                error = true;
            }

            if (!error) {
            return true;
            }
        }

        if (verifyLogin(loginData)){


            axios.post("http://localhost:8080/users/login", loginData)
            .then(response => {
                const user = response.data
                localStorage.setItem("userId", user.id)
                window.location.reload();
                setOpenLoginComponent(!openLoginComponent)


            })
            .catch(error => {
                console.log("Erro ao fazer a requisição do resultado de login :", error.message)
                setIsAnError(true);
                setAlertMessage("Usuário não encontrado")
                setShowAlertBox(true)
            })
        }
        
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const defaultInput = (title, type, name, placeholder) => {
        return (
            <div className="default-input-login-component">
                <label>{title}</label>
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    onChange={handleInputChange}
                />
            </div>
        )
    }

    return (
        <>
        <main className="login-component-container">
           <AlertBox setShowAlertBox={setShowAlertBox} showAlertBox={showAlertBox} isAnError={isAnError} alertMessage={alertMessage}/>
            <form>
                <div>
                    <h1>Login</h1>
                    <p>Já possui uma conta? <strong>Cadastre-se</strong></p>
                </div>
                <div>
                    {defaultInput("E-mail", "text", "email", "Digite seu e-mail aqui")}
                    {defaultInput("Senha", "password", "password", "Digite sua senha aqui")}
                </div>
                <div onClick={() => requestLogin()}>
                    <h1>Entrar</h1>
                </div>
                <div>
                    <img src="/imgs/x-icon.png" onClick={() => setOpenLoginComponent(!openLoginComponent)} />
                </div>
            </form>
        </main>
        </>
    )
}