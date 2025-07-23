import { useState } from "react"
import { useTaskContext } from "../_useContext/task_context"
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";

export default function TaskSortMenu({ title, field }: { title: string, field: string }) {
    const { sortBy } = useTaskContext()
    const [direction, setDirection] = useState('asc')

    const handleClick = (field: string, direction: string) => {
        switch (direction) {
            case 'asc':
                sortBy(field, 'asc')
                setDirection('desc')
                break
            case 'desc':
                sortBy(field, 'desc')
                setDirection('neutral')
                break
            case 'neutral':
                sortBy(field, 'neutral')
                setDirection('asc')
                break
        }
    }
    return (

        <button className="btn w-full" onClick={() => handleClick(field, `${direction}`)}> <span className="flex items-center justify-center gap-2">{title} {direction === 'asc' ? <FaSort /> : direction === 'desc' ? <FaSortUp /> : <FaSortDown />}</span></button>



    )
}