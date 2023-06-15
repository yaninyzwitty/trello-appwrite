import { databases } from "@/appWrite"

export const getTodosGroupedByColumns =  async() => {
    const data = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!);
    const todos = data.documents;
    // console.log(todos)
    const columns = todos.reduce((acc, todo) => {
        if (!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                todos: []
            })
        }
        acc.get(todo.status)!.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,

            // get image if it exists in the todo
            ...(todo.image && {image: JSON.parse(todo.image)})
        })
        return acc

    }, new Map<TypedColumn, Column>())
    // acc value starts of like a new map
    // if cols no typedColumn add with empty todo
    const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"]
    // loop using for each

    for ( const columnType of columnTypes){  //column-type is eeither todo inprogress or done
        if(!columns.get(columnType)){
            columns.set(columnType, {
                id: columnType,
                todos: [],
            });
        };
    }





        // implement so as to include the empty todos-->
        const sortedColumns = new Map(
            Array.from(columns.entries()).sort((a, b) => 
            columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]

            )
            )
        )
       
        

        const board:Board = {
            column: sortedColumns
        }

        return board;

    }

    
    

  
 

