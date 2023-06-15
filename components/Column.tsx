import {PlusCircleIcon} from "@heroicons/react/24/outline";
import {Draggable, Droppable} from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import {useBoardStore} from "@/store/BoardStore";
import useModalStore from "@/store/ModalStore";
type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

{
  /*
...and another Transition.Child to apply a separate transition
to the contents.
*/
}

function Column({id, todos, index}: Props) {
  const openModal = useModalStore((state) => state.openModal);
  const [searchString, setNewtaskType] = useBoardStore((state) => [
    state.searchString,
    state.setNewTaskType,
  ]);
  const idToColumnText: {[key in TypedColumn]: string} = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
  };
  const handleAddTodo = () => {
    setNewtaskType(id);

    openModal();
  };
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          {/* render droppable internal for todos in the cols */}
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`pb-2 p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                }`}
              >
                <h2 className="flex justify-between font-bold text-xl p-2">
                  {idToColumnText[id]}
                  <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal">
                    {!searchString
                      ? todos?.length
                      : todos?.filter((todo) =>
                          todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase())
                        ).length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {todos?.map((todo, index) => {
                    if (
                      searchString &&
                      !todo.title
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    )
                      return null;

                    return (
                      <Draggable
                        key={todo.$id}
                        index={index}
                        draggableId={todo.$id}
                      >
                        {(provided) => (
                          <TodoCard
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                            todo={todo}
                            index={index}
                            id={id}
                            innerRef={provided.innerRef}
                          />
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                  <div className="flex justify-end">
                    <button
                      className="text-green-500 hover:text-green-600"
                      onClick={handleAddTodo}
                    >
                      <PlusCircleIcon className="h-10 w-10 " />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
