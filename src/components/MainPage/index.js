import { useEffect, useState } from "react";
import "./MainPage.css";
import RegisterComponent from "../RegisterComponent";
import LoginComponent from "../LoginComponent";
import axios from "axios";
import AlertBox from "../AlertBox";
import BetHistoryPage from "../BetHistoryPage";
import EditProfilePage from "../EditProfilePage";

export default function MainPage() {

    // Alertbox usestates
    const [showAlertBox, setShowAlertBox] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [isAnError, setIsAnError] = useState(false)

    const [isLogged, setIsLogged] = useState(false);

    //General usestate's
    const [selectedBody, setSelectedBody] = useState('coinflip');
    const [amountBetted, setAmountBetted] = useState(0.00);
    const [amountReceived, setAmountReceived] = useState(0.00)
    const [amountToAdd, setAmountToAdd] = useState(0.00)
    const [multiplier, setMultiplier] = useState(2)

    // Open components usestate's
    const [openAddCashContainer, setOpenAddCashContainer] = useState(false)
    const [openRegisterComponent, setOpenRegisterComponent] = useState(false);
    const [openLoginComponent, setOpenLoginComponent] = useState(false);
    const [openProfileDropdown, setOpenProfileDropdown] = useState(false)



    const [selectedCoinSide, setSelectedCoinSide] = useState('silver')
    const [isFlipping, setIsFlipping] = useState(false);

    // User profile usestate
    const [profile, setProfile] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        birthdate: '',
        gender: '',
        balance: ''
    })


    useEffect(() => {
        handleAmountReceived(amountBetted, multiplier);
    }, [amountBetted, multiplier]);

    useEffect(() => {
        if (sessionStorage.getItem("userId") != null) {

            let userId = sessionStorage.getItem("userId")

            axios.get(`http://localhost:8080/users/${userId}`)
                .then(response => {
                    setProfile(response.data)
                    setIsLogged(true)

                })
                .catch(error => {
                    console.log("Erro ao fazer a requisição do resultado de login :", error.message)
                    setIsAnError(true);
                    setAlertMessage("Usuário não encontrado")
                    setShowAlertBox(true)
                    setIsLogged(false)
                })
        } else {
            setIsLogged(false)
        }
    }, [])


    function handleRoutes() {
        if (selectedBody === 'coinflip') { return coinflipGame() }
        if (selectedBody === 'bethistory') { return <BetHistoryPage /> }
        if (selectedBody === 'editprofile') { return <EditProfilePage /> }

    }

    function handleAmountBetted(e) {
        const value = parseFloat(e.target.value.replace(/[,.]/g, '')) || 0.00; // Ensure it's a number
        const bettedValue = value / 100;

        setAmountBetted(bettedValue);
        handleAmountReceived(bettedValue, multiplier); // Update received amount whenever betted value changes
    }

    function handleAmountToAdd(e) {
        const value = parseFloat(e.target.value.replace(/[,.]/g, '')) || 0.00; // Ensure it's a number
        const bettedValue = value / 100;

        setAmountToAdd(bettedValue);
    }

    function handleMultiplier(e) {
        const newMultiplier = e.target.value;
        setMultiplier(newMultiplier);

        handleAmountReceived(amountBetted, newMultiplier); // Update received amount with the new multiplier
    }

    function handleAmountReceived(bettedValue, newMultiplier) {
        setAmountReceived(formatNumber(bettedValue * newMultiplier));
    }

    function formatNumber(number) {
        return new Intl.NumberFormat('de-DE', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    }

    function updateUserBalance(amount) {
        const data = {
            "id": profile.id,
            "amount": amount
        }

        axios.put(`http://localhost:8080/users/balance`, data)
            .then(response => {
                console.log("Resposta balance : ", response.status)
            })
            .catch(error => {
                console.log("Erro ao fazer a requisição de apostas :", error.message)
            })
    }

    const loginHeader = () => {
        return (
            <div className="login-header">
                <p onClick={() => setOpenLoginComponent(!openLoginComponent)}>ENTRE</p>
                <div onClick={() => setOpenRegisterComponent(!openRegisterComponent)}>
                    <h1>
                        CADASTRE-SE
                    </h1>
                </div>
            </div>
        );
    }

    const loggedHeader = () => {
        return (
            <div className="logged-header">
                <img src="imgs/plus-icon.png" onClick={() => setOpenAddCashContainer(!openAddCashContainer)} />
                <h1>R$ {formatNumber(profile.balance)}</h1>
                <img src="imgs/profile-pic.png"
                    onClick={() => setOpenProfileDropdown(!openProfileDropdown)}
                />

                <section
                    style={{
                        opacity: openProfileDropdown ? '1' : '0',
                        visibility: openProfileDropdown ? 'visible' : 'hidden'
                    }}

                >
                    <div
                        onClick={() => {
                            setOpenProfileDropdown(false)
                            setSelectedBody('editprofile')
                        }}
                    >
                        <img src="imgs/profile-pic.png" />
                        <div >
                            <h1>Editar perfil</h1>
                            <p>./{profile.name}</p>
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            setSelectedBody("bethistory")
                            setOpenProfileDropdown(false)
                        }}
                    >
                        <img src="imgs/history-icon.png" />
                        <h1>Ver histórico de apostas</h1>
                    </div>
                    <div onClick={() => {
                        sessionStorage.removeItem("userId")
                        window.location.reload();
                    }}>
                        <img src="imgs/leave-icon.png" />
                        <h1>Sair</h1>
                    </div>
                </section>
            </div>
        )
    }

    const coinflipGame = () => {

        function registerBet(amount, odds, payout) {

            const bet = {
                "user_id": profile.id,
                "amount": amount,
                "odds": odds,
                "payout": payout
            }

            console.log(bet)

            axios.post(`http://localhost:8080/bets`, bet)
                .then(response => {
                    console.log("Resposta bets : ", response.status)
                })
                .catch(error => {
                    console.log("Erro ao fazer a requisição de apostas :", error.message)
                })

        }



        function flipCoin() {

            setIsFlipping(true);
            profile.balance = parseFloat(profile.balance) - parseFloat(amountBetted);


            setTimeout(() => {
                let userNumber = Math.floor((Math.random() * 10) + 1);
                let odds = Number.parseInt(multiplier) + 3;

                if (userNumber >= odds) {
                    setSelectedCoinSide(selectedCoinSide);

                    const win = parseFloat(profile.balance) + parseFloat(amountReceived.replace(".", "").replace(",", "."));
                    profile.balance = win;

                    registerBet(amountBetted, odds, parseFloat(amountReceived.replace(".", "").replace(",", ".")))
                    updateUserBalance(win);

                    setIsAnError(false);
                    setShowAlertBox(true);
                    setAlertMessage(`Você ganhou R$${amountReceived}!`)


                } else {
                    if (selectedCoinSide === 'silver') {
                        setSelectedCoinSide('gold');
                    } else {
                        setSelectedCoinSide('silver');
                    }

                    registerBet(amountBetted, odds, amountBetted - (amountBetted * 2))
                    updateUserBalance(profile.balance);

                    setShowAlertBox(true);
                    setIsAnError(true);
                    setAlertMessage(`Você perdeu R$${formatNumber(amountBetted)}!`)
                }

                setIsFlipping(false);
            }, 3000);
        }

        return (
            <main className="coinflip-container">
                <section>
                    <div>
                        <h1>DonkeyBet Coin flip</h1>
                        <img
                            className={isFlipping ? "coin-flip" : ""}
                            src={selectedCoinSide === 'silver' ? "/imgs/coinflip-silver.png" : "/imgs/coinflip-gold.png"}
                        />
                    </div>
                    <div>
                        <div>
                            <div
                                style={{
                                    border: selectedCoinSide === 'silver' ? '0.15vw solid #636679' : null,
                                    cursor: isFlipping && 'not-allowed',
                                    backgroundColor: isFlipping ? "#636679" : "#8388A1"
                                }}
                                onClick={!isFlipping ? () => setSelectedCoinSide('silver') : null}

                            />
                            <div
                                style={{
                                    border: selectedCoinSide === 'gold' ? '0.15vw solid #9c7325' : null,
                                    cursor: isFlipping && 'not-allowed',
                                    backgroundColor: isFlipping ? "#9c7325" : "#DAA035"
                                }}
                                onClick={!isFlipping ? () => setSelectedCoinSide('gold') : null}
                            />
                        </div>
                        <div>

                            <div>
                                <h1>VALOR APOSTADO </h1>
                                <div>
                                    <p>R$</p>
                                    <input
                                        value={formatNumber(amountBetted)} // Display formatted value
                                        onChange={handleAmountBetted}
                                        min="0.01"
                                    />
                                </div>
                            </div>
                            <div onClick={() => {
                                const newBettedAmount = amountBetted * 2;
                                setAmountBetted(newBettedAmount);
                                setAmountReceived(formatNumber(newBettedAmount * multiplier)); // Atualize amountReceived corretamente
                            }}>
                                <h2>2X</h2>
                            </div>
                        </div>

                        <div>
                            <h1>MULTIPLICADOR </h1>
                            <div>
                                <input
                                    type="range"
                                    step="1"
                                    min="2"
                                    max="5"
                                    value={multiplier}
                                    onChange={handleMultiplier}
                                />
                                <h2>{multiplier}X</h2>
                            </div>
                        </div>

                        <div>
                            <h1>VALOR RECEBIDO </h1>
                            <p>R$ {amountReceived}</p>
                        </div>

                        <div
                            style={{
                                cursor: !isLogged || isFlipping || amountBetted == 0 || amountBetted > profile.balance
                                    ? 'not-allowed' : 'pointer', // Set cursor style conditionally
                                backgroundColor: !isLogged || isFlipping || amountBetted == 0 || amountBetted > profile.balance
                                    && 'rgb(150, 64, 78)', // Set background color conditionally
                            }}
                            title={!isLogged ? "Você precisa estar logado para acessar esta área" : ""}
                            onClick={!isLogged || isFlipping || amountBetted == 0 || amountBetted > profile.balance
                                ? null
                                : () => flipCoin()}
                        >
                            <h1>GIRAR MOEDA</h1>
                        </div>
                    </div>
                </section>
                <section>
                    <div>
                        <h1>DonkeyBet Coin Flip</h1>
                    </div>
                    <div>
                        <img src="/imgs/coinflip-description-image.png" />
                        <div>
                            <div>
                                <div>
                                    <h1>NEW</h1>
                                </div>
                                <div>
                                    <h1>POPULAR</h1>
                                </div>
                            </div>
                            <div>
                                <p>Cara ou Coroa? O tradicional jogo chega ao mundo digital no emocionante DonkeyBet Coin Flip! Embarque numa jornada ao espaço sideral com gráficos  coloridos e adivinhe o resultado de até dez moedas! Criado pela Blaze, o jogo alia você a um carismático cão astronauta que não deixa nada a desejar em relação a ícones caninos da profissão como os russos  Laika e Cosmo! Aproveite a interface intuitiva e simples desta experiência! </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    const addCashContainer = () => {

        return (
            <main className="add-cash-container">
                <form>
                    <div>
                        <h1>Adicionar fundos</h1>
                        <p>Digite a quantidade que deseja adicionar abaixo.</p>
                    </div>
                    <div>
                        <h1>R$ </h1>
                        <input
                            value={formatNumber(amountToAdd)}
                            onChange={handleAmountToAdd}
                            min="0.01"
                        />
                    </div>
                    <div onClick={() => {
                        updateUserBalance(profile.balance + amountToAdd)
                        setOpenAddCashContainer(!openAddCashContainer)
                        window.location.reload();
                    }}>
                        <h1>Adicionar</h1>
                    </div>
                    <div >
                        <img src="/imgs/x-icon.png" onClick={() => setOpenAddCashContainer(!openAddCashContainer)} />
                    </div>
                </form>
            </main>
        );
    }

    return (
        <>
            <AlertBox setShowAlertBox={setShowAlertBox} showAlertBox={showAlertBox} isAnError={isAnError} alertMessage={alertMessage} />
            {openLoginComponent ? <LoginComponent
                setOpenLoginComponent={setOpenLoginComponent}
                openLoginComponent={openLoginComponent}
                setOpenRegisterComponent={setOpenRegisterComponent}
                setProfile={setProfile}
                setIsLogged={setIsLogged}
            /> : null}
            {openRegisterComponent ? <RegisterComponent
                setOpenRegisterComponent={setOpenRegisterComponent}
                openRegisterComponent={openRegisterComponent}
                setOpenLoginComponent={setOpenLoginComponent}
                setProfile={setProfile}
                setIsLogged={setIsLogged}
            /> : null}
            {openAddCashContainer ? addCashContainer() : null}
            <header>
                <div
                    onClick={() => {
                        setSelectedBody('coinflip')
                        setOpenProfileDropdown(false)
                    }}>
                    <img src="/imgs/donkeybet-logo.png" />
                    <h1>DonkeyBet</h1>
                </div>
                {isLogged ? loggedHeader() : loginHeader()}
            </header>
            <main className="container-content">
                <div className="container-sidebar">
                    <div>
                        <h1>Selecionar jogo</h1>
                        <ul>
                            <li
                                style={{
                                    borderRight: selectedBody === 'coinflip' ? '0.2vw solid red' : null,
                                    borderRadius: selectedBody === 'coinflip' ? '0.25vw 0 0 0.25vw' : null
                                }}
                                onClick={() => {
                                    setSelectedBody('coinflip')
                                    setOpenProfileDropdown(false)
                                }}
                            >
                                <img src="/imgs/coin-icon.png" />
                                <p>Coin flip</p>
                            </li>
                            <li>
                                <img src="imgs/bigger-or-less-icon.png" />
                                <p>Maior Menor</p>
                            </li>
                        </ul>
                        <h1>Ajuda</h1>
                        <ul>
                            <li>
                                <img src="imgs/headset-icon.png" />
                                <p>Suporte ao vivo</p>
                            </li>
                            <li>
                                <img src="imgs/send-icon.png" />
                                <p>Indicar para amigos</p>
                            </li>
                            <li>
                                <img src="imgs/question-icon.png" />
                                <p>Central de ajuda</p>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h1>Créditos</h1>
                        <ul>
                            <li>
                                <img src="imgs/dev-icon.png" />
                                <p>Caio Pacheco</p>
                            </li>
                            <li>
                                <img src="imgs/dev-icon.png" />
                                <p>Kayky Crespo</p>
                            </li>
                            <li>
                                <img src="imgs/dev-icon.png" />
                                <p>Helen Silva</p>
                            </li>
                            <li>
                                <img src="imgs/dev-icon.png" />
                                <p>Elias de Souza</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="container-game">
                    {handleRoutes(selectedBody)}
                </div>
            </main>
        </>
    )
}
