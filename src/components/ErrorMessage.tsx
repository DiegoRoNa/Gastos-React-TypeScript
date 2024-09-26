import { ReactNode } from "react"

/**
 * ReactNode, permite renderizar string, y componentes
 * Entonces children es un mensaje que viene desde el form
 * Por eso no se puede poner que children es de tipo string, porque tambien puede ser un componente
 * Tambien se puede usar el type "PropsWithChildren", que es de React
 */
type ErrorMessageProps = {
    children: ReactNode
}

export default function ErrorMessage({children} : ErrorMessageProps) {
    return (
        <p className="bg-red-600 p-2 text-white font-bold text-sm text-center">{children}</p>
    )
}
