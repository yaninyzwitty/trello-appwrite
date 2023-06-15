interface Board {
    // typedColumn is the key and value is the column---> so each key has a column
    column: Map<TypedColumn, Column>
}

type TypedColumn = "todo" | "inprogress" | "done"; //enum

interface Column {
    id: TypedColumn;
    todos: Todo[];

}

interface Todo {
    // with dollar sign from appwrite
    $id: string;
    $createdAt: string;
    title: string;
    status: TypedColumn;
    image?: Image;
}

interface Image {
    bucketId: string;
    fileId: string;

}