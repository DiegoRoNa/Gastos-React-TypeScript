

/**HAY QUE IMPORTAR EL "BudgetProvider" A "main.tsx" PARA MANTENER EL ESTADO GLOBAL EN TODA LA APP*/

import { useReducer, createContext, Dispatch, ReactNode, useMemo } from "react"
import { budgetReducer, BudgetState, initialState, BudgetActions } from "../reducers/BudgetReducer"

/**
 * Asi mantenemos informado al context el tipo de datos que espera del provider
 */
type BudgetContextProps = {
    state: BudgetState
    dispatch: Dispatch<BudgetActions>
    totalExpenses: number
    remainingBudget: number
}

/**
 * props de children
 */
type BudgetProviderProps = {
    children: ReactNode
}

/**
 * El context es el estado global del state
 * "null!", es para que se quite el error
 */
export const BudgetContext = createContext<BudgetContextProps>(null!)


/**
 * Provider, es de dónde vienen los datos
 * Son los datos que va a tener el context
 * "children", es un prop especial que hace referencia a los hijos de un componente
 */
export const BudgetProvider = ({children} : BudgetProviderProps) => {

    const [state, dispatch] = useReducer(budgetReducer, initialState)
    
    // calcular lo gastado
    const totalExpenses = useMemo(() => state.expenses.reduce((total, expense) => expense.amount + total, 0), [state.expenses])

    // calcular lo disponible
    const remainingBudget = state.budget - totalExpenses

    return (
        /**
         * se comporta como un componente padre, que cubre toda la app
         * BudgetContext, siempre tienen el prop de value (que es un objeto), para pasarle el state y el dispatch
         * De esa forma ya están conectados el context y el provider
         */
        <BudgetContext.Provider value={{state, dispatch, totalExpenses, remainingBudget}}>
            {children}
        </BudgetContext.Provider>
    )
}