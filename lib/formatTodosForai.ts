const formatTodosForai = (board: Board) => {
    const todos = Array.from(board.column.entries());


    const flatArray = todos.reduce((map, [key, value]) => {
        map[key] = value.todos;
        return map;
    }, {} as { [key in TypedColumn]: Todo[]});

    const flatArrayCounted = Object.entries(flatArray).reduce(
        (map, [key, value]) => {
            map[key as TypedColumn] = value.length
            return map;
            },
            {} as { [key in TypedColumn]: number}
        
    )


    return flatArrayCounted;


   
}


export default formatTodosForai;