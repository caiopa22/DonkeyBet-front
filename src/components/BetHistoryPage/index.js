import { useEffect, useState } from "react";
import "./BetHistoryPage.css"
import axios from "axios"

export default function BetHistoryPage(){

    const [bets, setBets] = useState([])
    
    useEffect(() => {
        fetchBetsPageable()
    }, [])

    const fetchBetsPageable = async () => {
        const userId = sessionStorage.getItem("userId")

        await axios.get(`http://localhost:8080/bets/${userId}`)
        .then(response => {
            const data = response.data
            console.log(data)

            const sortedBets = data.content.sort((a, b) => new Date(b.betDate) - new Date(a.betDate));
            setBets(sortedBets) 
        })
        .catch(error => {
            console.log("Erro ao fazer a requisição do resultado de login :", error.message)

        })

    }

    const defaultBetView = (date, amount, odds, payout) => {
        
        let hasWon = payout > 0 ? true : false
        
        return (
            <div className="default-bet-view-container">
                <label>{date}</label>
                <div>
                    
                    <h1 style={{color: hasWon ? "#7DFF7D" : "#F12C4C"}}>{hasWon ? "Vitória" : "Derrota"}</h1>
                    <h2>Odds {10 - odds}0%</h2>
                    <div
                    style={{display: hasWon ? 'flex' : 'none'}}
                    >
                        <h2>Valor apostado</h2>
                        <p>R${amount}</p>
                    </div>
                    <h1 style={{color: hasWon ? "#7DFF7D" : "#F12C4C"}}>
                        {hasWon ? "+ " : "- "} 
                        R${Math.abs(payout).toFixed(2)}</h1>
                </div>
            </div>
        )
    }
    
    return (
        <main className="bet-history-page-container">
            <section>
                <h1>Histórico de apostas</h1>
                <div>
                    {bets.map(bet => 
                        defaultBetView(new Date(bet.betDate).toLocaleString(), bet.amount, bet.odds, bet.payout)
                    )}
                </div>
            </section>
        </main>
    );
}
