import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import { useBudget } from "../hooks/useBudget";
import AmauntDisplay from "./AmountDisplay";
import "react-circular-progressbar/dist/styles.css"

export default function BudgetTracker() {

    const {state, dispatch, totalExpenses, remainingBudget} = useBudget()
    const percentage = +((totalExpenses / state.budget) * 100).toFixed(2)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex justify-center">
                <CircularProgressbar value={percentage} 
                styles={buildStyles({
                    pathColor: percentage === 100 ? '#DC2626' : '#3b82f6', 
                    trailColor: '#f5f5f5', 
                    textSize: 8, 
                    textColor: '#3b82f6'
                })}
                text={`${percentage}% gastado`} />
            </div>

            <div className="flex flex-col justify-center items-center gap-8">
                <button onClick={() => dispatch({type: 'reset-app'})} className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg" type="button">Resetear app</button>

                <AmauntDisplay label="Presupuesto" amount={state.budget}/>
                <AmauntDisplay label="Disponible" amount={remainingBudget}/>
                <AmauntDisplay label="Gastado" amount={totalExpenses}/>
            </div>
        </div>
    )
}
