import { useContext } from "react"
import { BudgetContext } from "../context/BudgetContext"

export const useBudget = () => {
    /**
     * Es el context que mantendrá el state global en toda la app
     */
    const context = useContext(BudgetContext)

    if (!context) {
        throw new Error('useBudget must be used within a BudgetProvider')
    }

    return context
}