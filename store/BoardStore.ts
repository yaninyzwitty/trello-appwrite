import { ID, databases, storage } from '@/appWrite';
import { getTodosGroupedByColumns } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    getBoard: () => void;
    newTaskInput: string;
    image: File | null;
    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
    setBoardState: (board: Board) => void; //takes the board ans sets it to the state..
    updateTodoToDb: (todo: Todo, columnId: TypedColumn) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;
    setNewTaskInput: (input: string) => void;
    newTaskType: TypedColumn
    setNewTaskType: (columnId: TypedColumn) => void;
    setImage: (image: File | null) => void;


    deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void



}


export const useBoardStore = create<BoardState>((set, get) => ({
    // board as null

    board: {
        column: new Map<TypedColumn, Column>()

    },
    getBoard: async () => {
        const board = await getTodosGroupedByColumns();
        set({ board });

        // sets global stte for that value..

    },
    searchString: '',
    newTaskInput: "",
    newTaskType: "todo",
    image: null,
    setImage: (image: File | null) => set({ image }),

    setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),

    setSearchString: (searchString: string) => set({ searchString }),
    setNewTaskInput: (input: string) => set({ newTaskInput: input }),
    setBoardState: (board) => set({ board }),
    updateTodoToDb: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId,
            }
        )

    },
    addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
        let file: Image | undefined;
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }


    // creating a doc
    const { $id } = await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        ID.unique(),
        
         {
        title: todo,
        status: columnId,
        // include image if it exists
        ...(file && { image: JSON.stringify(file) }),
    });

    set({ newTaskInput: ""});

    set((state) => {
        const newColumns = new Map(state.board.column);
        const newTodo: Todo = {
            $id,
            $createdAt: new Date().toISOString(),
            title: todo,
            status: columnId,
            // include if it exists
            ...(file && { image: file }),

        };

        const column = newColumns.get(columnId);
        console.log(column)

        if(!column){
            newColumns.set(columnId, {
                id: columnId,
                todos: [newTodo]
            });

        } else {
            newColumns.get(columnId)?.todos.push(newTodo);
        }
        return {
            board: {
                column: newColumns
            }
        }
    
    })

    

    
    },
    deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
        const newColumns = new Map(get().board.column)
        newColumns.get(id)?.todos.splice(taskIndex, 1);

        set({ board: { column: newColumns }})
        if(todo.image!) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        }

        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        )
    

       






        
    

        
    }
}))







