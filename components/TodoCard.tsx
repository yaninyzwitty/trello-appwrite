import getUrl from "@/lib/getUrl";
import {useBoardStore} from "@/store/BoardStore";
import {XCircleIcon} from "@heroicons/react/24/outline";
import Image from "next/image";
import {useEffect, useState} from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };
      fetchImage();
    }
  }, [todo]);
  const deleteTask = useBoardStore((state) => state.deleteTask);

  return (
    <div
      {...dragHandleProps}
      {...draggableProps}
      ref={innerRef}
      className="space-y-2 drop-shadow-md bg-white rounded-md"
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button
          className="text-red-500 hover:text-red-600"
          onClick={() => deleteTask(index, todo, id)}
        >
          <XCircleIcon className="ml-5 h-8 w-8 " />
        </button>
      </div>
      {/* imageUrl here */}

      {imageUrl && (
        <div className="relative h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
            alt="Task Image"
          />
        </div>
      )}
    </div>
  );
}

export default TodoCard;
