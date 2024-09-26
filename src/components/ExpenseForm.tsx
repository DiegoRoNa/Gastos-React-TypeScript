import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { categories } from "../data/categories";
import type { DraftExpense, Value } from "../types";
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    })
    const [error, setError] = useState('')
    const [previousAmount, setPreviousAmount] = useState(0)
    const {state, dispatch, remainingBudget} = useBudget()

    // funcion para tomar el gasto que se quiere editar
    useEffect(() => {
        if (state.editingId) {
            // el [0], es para que retorne el objeto
            const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
            setExpense(editingExpense)
            setPreviousAmount(editingExpense.amount) // congelar el presupuesto actual
        }
    }, [state.editingId])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target
        const isAmountField = ['amount'].includes(name) // leer el campo de amount

        setExpense({
            ...expense,
            [name]: isAmountField ? +value : value // [name], refiere al atributo de los inputs
        })
    }

    const handleChangeDate = (value : Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // validar formulario
        if (Object.values(expense).includes('')) {
            setError('Todos los campos son obligatorios')
            return
        }

        // validar no sobrepasar el presupuesto
        if ((expense.amount - previousAmount) > remainingBudget) {
            setError('Ya no tienes presupuesto suficiente para agregar este gasto')
            return
        }

        // agregar o actualizar un gasto
        if (state.editingId) { // hay algo en el id editado
            dispatch({type: 'update-expense', payload: {expense: {id: state.editingId, ...expense}}})
        } else { // un gasto nuevo
            dispatch({type: 'add-expense', payload: {expense}})
        }

        // reiniciar state para limpiar el form
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date()
        })
        setPreviousAmount(0) // limpiar presupuesto
    }
    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">{state.editingId ? 'Edita el gasto' : 'Nuevo gasto'}</legend>    

            {/**mensaje de error de validacion */}
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">Nombre del gasto: </label>
                <input type="text" className="bg-slate-100 p-2" onChange={handleChange}
                        value={expense.expenseName} name="expenseName" id="expenseName" 
                        placeholder="Añade el nombre del gasto"/>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">Cantidad: </label>
                <input type="number" className="bg-slate-100 p-2" onChange={handleChange}
                        value={expense.amount} name="amount" id="amount" 
                        placeholder="Añade la cantidad. Ej: 300"/>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-xl">Categoría: </label>
                <select name="category" id="category" value={expense.category} 
                        className="bg-slate-100 p-2" onChange={handleChange}>
                    <option value="" disabled selected>-- Selecciona --</option>
                    {categories.map( category => (
                        <option value={category.id} key={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">Fecha gasto: </label>
                <DatePicker className="bg-slate-100 p-2 border-0" onChange={handleChangeDate} value={expense.date}/>
            </div>

            <input type="submit" value={state.editingId ? 'Guardar cambios' : 'Registrar gasto'} className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"/>
        </form>
    )
}
