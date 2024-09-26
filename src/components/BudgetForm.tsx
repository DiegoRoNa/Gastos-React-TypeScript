import { useState, ChangeEvent, useMemo, FormEvent } from "react"
import { useBudget } from "../hooks/useBudget"

export default function BudgetForm() {
    const [budget, setBudget] = useState(0)

    // hook que usaremos para controlar el context
    const {dispatch} = useBudget()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBudget(e.target.valueAsNumber) // el "AsNumber" es para castear a number
    }

    const isNotValid = useMemo(() => {
        return isNaN(budget) || budget <= 0
    }, [budget])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // agregar presupuesto
        dispatch({type: 'add-budget', payload: {budget}})
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-5">
                <label htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">
                    Definir presupuesto
                </label>
                <input type="number" name="budget" id="budget" value={isNaN(budget) ? '' : budget}
                        onChange={handleChange}
                        placeholder="Define tu presupuesto"
                        className="w-full bg-white border border-gray-200 p-2" />
            </div>

            <input type="submit" value="Definir presupuesto" disabled={isNotValid}
                    className="bg-blue-700 hover:bg-blue-900 cursor-pointer w-full p-2 disabled:opacity-40 text-white font-black uppercase" />
        </form>
    )
}
