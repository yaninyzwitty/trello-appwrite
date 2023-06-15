"use client";
import {useBoardStore} from "@/store/BoardStore";
import {useEffect} from "react";
import {DragDropContext, DropResult, Droppable} from "react-beautiful-dnd";
import Column from "./Column";

function Board() {
  const [board, setBoardState, getBoard, updateTodoToDb] = useBoardStore(
    (state) => [
      state.board,
      state.setBoardState,
      state.getBoard,
      state.updateTodoToDb,
    ]
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleDragEnd = (result: DropResult) => {
    const {destination, type, source} = result;
    // ? Check if user dragged card outside of board

    if (!destination) return;
    // handle column drag
    if (type === "column") {
      const entries = Array.from(board.column.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({...board, column: rearrangedColumns});
    }

    // if type === card ---implement this

    // * This step is needed as the indexes are stored as numbers 0, 1, 2, etc. Instead of id's with DND' library.
    const columns = Array.from(board.column); //make a copy of columns-- map
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    if (source.index === destination.index && startCol === finishCol) return;
    const newTodos = startCol.todos;

    const [todoMoved] = newTodos.splice(source.index, 1); //removed the todo--->

    if (startCol.id === finishCol.id) {
      // if in same card
      newTodos.splice(destination.index, 0, todoMoved);

      const newColumn = {
        id: startCol.id,
        todos: newTodos,
      };

      const newColumns = new Map(board.column);
      newColumns.set(startCol.id, newColumn);

      setBoardState({column: newColumns});
    } else {
      // diff col drag
      const finishedTodos = Array.from(finishCol.todos);
      finishedTodos.splice(destination.index, 0, todoMoved);

      const newColumn = {
        id: startCol.id,
        todos: newTodos,
      };

      const newColumns = new Map(board.column);

      // modified start cols
      newColumns.set(startCol.id, newColumn);
      // trying to add to the finishede col
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishedTodos,
      });

      // update the db
      updateTodoToDb(todoMoved, finishCol.id);

      setBoardState({...board, column: newColumns});
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      j
      <Droppable droppableId="board" direction="horizontal" type="column">
        {/* first child spread props */}

        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto"
          >
            {Array.from(board.column.entries()).map(([id, column], index) => (
              <Column id={id} todos={column.todos} index={index} key={id} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
