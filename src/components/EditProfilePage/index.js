import { useEffect, useState } from "react";
import AlertBox from "../AlertBox";
import "./EditProfilePage.css"
import axios from "axios"

export default function EditProfilePage(name, email, gender) {

    // Alertbox usestates
    const [showAlertBox, setShowAlertBox] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [isAnError, setIsAnError] = useState(false)


    const [editProfile, setEditProfile] = useState({
        name: name || '',
        email: email || '',
        gender: gender || ''
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: ''
    });
    
    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            gender: editProfile.gender
        }));
    }, [editProfile]);

    useEffect(() => {
        fetchEditProfileData()
    }, [])


    const fetchEditProfileData = async () => {
        if (sessionStorage.getItem("userId") != null) {

            let userId = sessionStorage.getItem("userId")

            await axios.get(`http://localhost:8080/users/${userId}`)
                .then(response => {
                    setEditProfile(response.data)
                })
        }
    }

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
                <AlertBox setShowAlertBox={setShowAlertBox} showAlertBox={showAlertBox} isAnError={isAnError} alertMessage={alertMessage} />
                <div className="default-edit-profile-component-input">
                    <label>{title}</label>
                    {type === "radio" ? (
                        <div>
                            {options.map((option, index) => (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name={name}
                                        value={option.value}
                                        checked={formData.gender === option.value}
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

    const requestAlterData = () => {
        const verifyChanges = (data) => {
            let error = false;

            if (data.name){
                if (data.name === '') {
                    setIsAnError(true);
                    setAlertMessage("Nome não pode ser vazio")
                    setShowAlertBox(true)
                    error = true;
                }
            }

            if (data.email) {
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
            }

            if (data.password || data.confirmPassword) {
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
            }

            if (data.gender) {
                if (data.gender === '') {
                    setIsAnError(true);
                    setAlertMessage("Selecione seu genero")
                    setShowAlertBox(true)
                    error = true;
                }
            }

            if (!error) {
                return true;
            }
        }

        if (verifyChanges(formData)){
            const dataToSend = { ...formData, id: editProfile.id };
            delete dataToSend.confirmPassword;

            axios.put("http://localhost:8080/users", dataToSend)
                .then(response => {
                    window.location.reload();
                    setShowAlertBox(true)
                    setIsAnError(false)
                    setAlertMessage("Informações alteradas com sucesso")
                })
                .catch(error => {
                    console.log("Erro ao fazer a requisição do resultado de registro :", error.message)
                    setIsAnError(true);
                    setAlertMessage("Ocorreu um erro ao alterar as informações")
                    setShowAlertBox(true)
                })
        }
    }

    return (
        <main className="edit-profile-component-container">
            <form>
                <div>
                    <h1>Editar perfil</h1>
                    <p>Aqui voce pode alterar as informações do seu perfil!</p>
                </div>
                <div>
                    {defaultInput("Nome", "text", "name", editProfile.name)}
                    {defaultInput("E-mail", "text", "email", editProfile.email)}
                    {defaultInput("Trocar senha", "text", "password", "********")}
                    {defaultInput("Confirmar senha", "text", "confirmPassword", "********")}
                    {defaultInput("Gênero", "radio", "gender", editProfile.gender, [
                        { value: "M", label: "Masculino" },
                        { value: "F", label: "Feminino" },
                        { value: "X", label: "Outro" },
                    ])}
                </div>
                <div onClick={() => requestAlterData()}>
                    <h1>Salvar</h1>
                </div>
            </form>
        </main>
    );
}