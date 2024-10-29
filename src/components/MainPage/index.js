import { useEffect, useState } from "react";
import "./MainPage.css";
import RegisterComponent from "../RegisterComponent";
import LoginComponent from "../LoginComponent";
import AlertBox from "../AlertBox";


export default function MainPage() {

    // Alertbox usestates
    const [showAlertBox, setShowAlertBox] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [isAnError, setIsAnError] = useState(false)

    //General usestate's
    const [isLogged, setIsLogged] = useState(false);
    const [selectedGame, setSelectedGame] = useState('coinflip');
    const [amountBetted, setAmountBetted] = useState(0.00);
    const [amountReceived, setAmountReceived] = useState(0.00)
    const [multiplier, setMultiplier] = useState(2)
    const [openRegisterComponent, setOpenRegisterComponent] = useState(false);
    const [openLoginComponent, setOpenLoginComponent] = useState(false);


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


    const [selectedCoinSide, setSelectedCoinSide] = useState('silver')
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        handleAmountReceived(amountBetted, multiplier);
    }, [amountBetted, multiplier]);

    useEffect(() => {
        if (isLogged) {
            setIsAnError(false);
            setAlertMessage("Login efetuado com sucesso")
            setShowAlertBox(true)

            localStorage.setItem("userId", profile.id)
        }
    }, [isLogged])


    const handleCoinSideChange = (side) => {
        setIsFlipping(true);
        setTimeout(() => {
            setSelectedCoinSide(side);
            setIsFlipping(false);
        }, 3000);
    };

    function handleAmountBetted(e) {
        const value = parseFloat(e.target.value.replace(/[,.]/g, '')) || 0.00; // Ensure it's a number
        const bettedValue = value / 100;

        setAmountBetted(bettedValue);
        handleAmountReceived(bettedValue, multiplier); // Update received amount whenever betted value changes
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
                <img src="imgs/plus-icon.png" />
                <h1>R$ {profile.balance}</h1>
                <img src="imgs/profile-pic.png" />
            </div>
        )
    }

    const coinflipGame = () => {

        function flipCoin(){
            
            let userNumber = Math.floor((Math.random() * 10) + 1);
            let odds = Number.parseInt(multiplier) + 3;

            if (userNumber >= odds){
                handleCoinSideChange(selectedCoinSide)
                setIsAnError(false);
                setShowAlertBox(true)

            } else {
                if (selectedCoinSide === 'silver'){
                    handleCoinSideChange('gold')
                }
                if (selectedCoinSide === 'gold'){
                    handleCoinSideChange('silver')
                }
                setIsAnError(false);
                setShowAlertBox(true)
            }

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
                                style={selectedCoinSide === 'silver' ? { border: '0.15vw solid #636679' } : {}}
                                onClick={() => setSelectedCoinSide('silver')}
                            />
                            <div
                                style={selectedCoinSide === 'gold' ? { border: '0.15vw solid #9c7325' } : {}}
                                onClick={() => setSelectedCoinSide('gold')}
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
                                setAmountBetted(amountBetted * 2)
                                setAmountReceived((amountBetted * 2) * multiplier)
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
                                cursor: !isLogged && 'not-allowed', // Set cursor style conditionally
                                backgroundColor: !isLogged && 'rgb(150, 64, 78)', // Set background color conditionally
                            }}
                            title={!isLogged ? "Você precisa estar logado para acessar esta área" : ""}
                            onClick={() => flipCoin()}
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
                                <p>Cara ou Coroa? O tradicional jogo chega ao mundo digital no emocionante DonkeyBet Coin Flip! Embarque numa jornada ao espaço sideral com gráficos  coloridos e adivinhe o resultado de até dez moedas! Criado pela própria  Blaze, o jogo alia você a um carismático cão astronauta que não deixa  nada a desejar em relação a ícones caninos da profissão como os russos  Laika e Cosmo! Aproveite a interface intuitiva e simples desta experiência! </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <>
            <AlertBox setShowAlertBox={setShowAlertBox} showAlertBox={showAlertBox} isAnError={isAnError} alertMessage={alertMessage} />
            {openLoginComponent ? <LoginComponent
                setOpenLoginComponent={setOpenLoginComponent}
                openLoginComponent={openLoginComponent}
                setProfile={setProfile}
                setIsLogged={setIsLogged}
            /> : null}
            {openRegisterComponent ? <RegisterComponent
                setOpenRegisterComponent={setOpenRegisterComponent}
                openRegisterComponent={openRegisterComponent}
                setProfile={setProfile}
                setIsLogged={setIsLogged}
            /> : null}
            <header>
                <div>
                    <img src="/imgs/donkeybet-logo.png" />
                    <h1>DonkeyBet</h1>
                    {isLogged && (<h2>Bem vindo, <strong>{profile.name.split(' ')[0]}</strong>.</h2>)}
                </div>
                {isLogged ? loggedHeader() : loginHeader()}
            </header>
            <main className="container-content">
                <div className="container-sidebar">
                    <div>
                        <h1>Selecionar jogo</h1>
                        <ul>
                            <li>
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
                                <p>Elias</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="container-game">
                    {selectedGame === 'coinflip' ? coinflipGame() : (<></>)}
                </div>
            </main>
        </>
    )
}
