import { useTaskContext } from "../_useContext/task_context"

export default function TaskSortMenu() {
    const { sortBy } = useTaskContext()
    return (
        <div className="bg-white flex flex-col gap-2 items-center justify-center">
            <label htmlFor="sort_param" className="text-black">Sort by</label>
            <select name="sort_param" id="sort_param" className="text-black" onChange={(e) => sortBy(e.target.value)}>
                <option className="" value="none">-- Reset --</option>
                <option className="" value="deadline">Sort by deadline</option>
                <option className="" value="priority">Sort by priority</option>
            </select>

        </div>

    )
}