import { useEffect, useState } from "react";
import axios from "axios";
import "./RegisterComponent.css";
import AlertBox from "../AlertBox";

export default function RegisterComponent({ setOpenRegisterComponent, openRegisterComponent, setProfile, setIsLogged }) {

    // Alertbox usestates
    const [showAlertBox, setShowAlertBox] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [isAnError, setIsAnError] = useState(false)

    // Estados para cada campo do formulário
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthdate: '',
        password: '',
        confirmPassword: '',
        gender: ''
    });

    function requestRegister() {

        const calculateAge = (birthdate) => {
            const today = new Date();
            const birthDate = new Date(birthdate);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
    
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
    
            return age;
        }

        const verifyRegister = (data) => {
            let error = false;



            if (data.name === '') {
                setIsAnError(true);
                setAlertMessage("Nome não pode ser vazio")
                setShowAlertBox(true)
                error = true;
            }

            if (data.email === '') {
                setIsAnError(true);
                setAlertMessage("E-mail não pode ser vazio")
                setShowAlertBox(true)
                error = true;

                setFormData({
                    ...formData,
                    email : ''
                })
            }

            if (!(data.email).includes("@")) {
                setIsAnError(true);
                setAlertMessage("E-mail precisa ser válido")
                setShowAlertBox(true)
                error = true;

                setFormData({
                    ...formData,
                    email : ''
                })
            }

            if (calculateAge(data.birthdate) < 18) {


                setIsAnError(true);
                setAlertMessage("Você precisa ter pelo menos 18 anos para se cadastrar");
                setShowAlertBox(true);
                error = true;
            }

            if (!/[@#$@!#?]/.test(data.password)) {
                setIsAnError(true);
                setAlertMessage("Sua senha deve conter caracteres especiais")
                setShowAlertBox(true)
                error = true;
            }

            if (!/[A-Z]/.test(data.password)) {
                setIsAnError(true);
                setAlertMessage("Sua senha deve conter letras maísculas")
                setShowAlertBox(true)
                error = true;
            }

            if (data.password !== data.confirmPassword) {


                setIsAnError(true);
                setAlertMessage("As senhas não são iguais.")
                setShowAlertBox(true);
                setFormData({
                    ...formData,
                    password: '',
                    confirmPassword: ''
                })
                error = true;
            }

            if (data.password === '' || data.password2 === '') {
                setIsAnError(true);
                setAlertMessage("Senha não pode ser vazia")
                setShowAlertBox(true)
                setFormData({
                    ...formData,
                    password: '',
                    confirmPassword: ''
                })
                error = true;
            }

            if (data.gender === '') {
                setIsAnError(true);
                setAlertMessage("Selecione seu genero")
                setShowAlertBox(true)
                error = true;
            }


            if (!error) {
                return true;
            }
        }


        if (verifyRegister(formData)) {
            const dataToSend = { ...formData };
            delete dataToSend.confirmPassword;

            axios.post("http://localhost:8080/users", dataToSend)
                .then(response => {
                    const user = response.data
                    localStorage.setItem("userId", user.id)
                    window.location.reload();
                    setOpenRegisterComponent(!openRegisterComponent)
                })
                .catch(error => {
                    console.log("Erro ao fazer a requisição do resultado de registro :", error.message)
                    setIsAnError(true);
                    setAlertMessage("Ocorreu um erro ao criar seu cadastro")
                    setShowAlertBox(true)
                })
        }
    }



    // Função para atualizar os estados conforme o usuário digita
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const defaultInput = (title, type, name, placeholder, options = []) => {
        return (
            <>
            <AlertBox setShowAlertBox={setShowAlertBox} showAlertBox={showAlertBox} isAnError={isAnError} alertMessage={alertMessage}/>
            <div className="default-register-component-input">
                <label>{title}</label>
                {type === "radio" ? (
                    <div>
                        {options.map((option, index) => (
                            <label key={index}>
                                <input
                                    type="radio"
                                    name={name}
                                    value={option.value}
                                    checked={formData[name] === option.value}
                                    onChange={handleInputChange}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        placeholder={placeholder}
                        onChange={handleInputChange}
                    />
                )}
            </div>
            </>
        );
    };

    return (
        <main className="register-component-container">
            <form>
                <div>
                    <h1>Cadastro</h1>
                    <p>Já possui uma conta? <strong>Login</strong></p>
                </div>
                <div>
                    {defaultInput("Nome", "text", "name", "Digite seu nome aqui")}
                    {defaultInput("E-mail", "text", "email", "Digite seu e-mail aqui")}
                    {defaultInput("Data de nascimento", "date", "birthdate")}
                    {defaultInput("Senha", "text", "password", "********")}
                    {defaultInput("Confirmar senha", "text", "confirmPassword", "********")}
                    {defaultInput("Gênero", "radio", "gender", "", [
                        { value: "M", label: "Masculino" },
                        { value: "F", label: "Feminino" },
                        { value: "X", label: "Outro" },
                    ])}
                </div>
                <div onClick={() => requestRegister()}>
                    <h1>CADASTRAR</h1>
                </div>
                <div onClick={() => setOpenRegisterComponent(!openRegisterComponent)}>
                    <img src="/imgs/x-icon.png" />
                </div>
            </form>
        </main>
    );
}
