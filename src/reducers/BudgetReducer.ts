import { v4 as uuidv4 } from 'uuid'
import { Category, DraftExpense, Expense } from "../types"

export type BudgetActions = 
{type: 'add-budget', payload: {budget: number}} | // accion para asignar presupuesto nuevo
{type: 'show-modal'} | // accion para mostrar el modal
{type: 'close-modal'} | // accion para cerrar el modal
{type: 'add-expense', payload: {expense: DraftExpense}} | // accion para agregar un gasto
{type: 'delete-expense', payload: {id: Expense['id']}} | // accion para eliminar un gasto
{type: 'get-expense-by-id', payload: {id: Expense['id']}} | // accion para eliminar un gasto
{type: 'update-expense', payload: {expense: Expense}} | // accion para actualizar un gasto
{type: 'reset-app'} | // accion para reiniciar la app
{type: 'add-filter-category', payload: {id: Category['id']}}  // accion para filtrar

export type BudgetState = {
    budget: number
    modal: boolean
    expenses: Expense[]
    editingId: Expense['id']
    currentCategory: Category['id']
}

// almacenar en localstorage
const initialBudget = () : number => {
    const localStorageBudget = localStorage.getItem('budget')
    return localStorageBudget ? +localStorageBudget : 0
}

const localStorageExpenses = () : Expense[] => {
    const localStorageExpenses = localStorage.getItem('expenses')
    return localStorageExpenses ? JSON.parse(localStorageExpenses) : []
}

export const initialState : BudgetState = {
    budget: initialBudget(),
    modal: false,
    expenses: localStorageExpenses(),
    editingId: '',
    currentCategory: ''
}

const createExpense = (draftExpense: DraftExpense) : Expense => {
    return {
        ...draftExpense,
        id: uuidv4()
    }
}

export const budgetReducer = (state: BudgetState = initialState, action: BudgetActions) => {
    if (action.type === 'add-budget') {
        
        return {
            ...state,
            budget: action.payload.budget
        }
    }

    if (action.type === 'show-modal') {
        
        return {
            ...state,
            modal: true
        }
    }

    if (action.type === 'close-modal') {
        
        return {
            ...state,
            modal: false,
            editingId: ''
        }
    }

    if (action.type === 'add-expense') {
        
        const expense = createExpense(action.payload.expense)
        
        return {
            ...state,
            expenses: [...state.expenses, expense],
            modal: false // cerrar modal
        }
    }

    if (action.type === 'delete-expense') {
        
        return {
            ...state,
            expenses: state.expenses.filter( exp => exp.id !== action.payload.id)
        }
    }

    if (action.type === 'get-expense-by-id') {
        
        return {
            ...state,
            editingId: action.payload.id,
            modal: true
        }
    }

    if (action.type === 'update-expense') {
        
        return {
            ...state,
            expenses: state.expenses.map( exp => exp.id === action.payload.expense.id 
                ? action.payload.expense : exp ),
            modal: false,
            editingId: ''
        }
    }

    if (action.type === 'reset-app') {
        
        return {
            ...state,
            budget: 0,
            expenses: []
        }
    }

    if (action.type === 'add-filter-category') {
        
        return {
            ...state,
            currentCategory: action.payload.id
        }
    }

    return state
}