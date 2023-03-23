import axios from "axios";
import Head from "next/head";
import { useRef, useState } from "react";

type Todo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

type Todos = {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
};

const USER_ID = 1;

const getTodos = async () => {
  const result = await axios.get<Todos>(
    `https://dummyjson.com/todos/user/${USER_ID}`
  );
  return result.data;
};

const addTodo = async (content: string) => {
  return await fetch("https://dummyjson.com/todos/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      todo: content,
      completed: false,
      userId: USER_ID,
    }),
  }).then((res) => res.json());
};

const deleteTodo = async (id: number) => {
  return await fetch(`https://dummyjson.com/todos/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
};

const changeTodoCompleted = async ({
  id,
  completed,
}: {
  id: number;
  completed: boolean;
}) => {
  return await fetch(`https://dummyjson.com/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      completed,
    }),
  }).then((res) => res.json());
};

export async function getServerSideProps() {
  const data = await getTodos();

  return { props: { data: JSON.parse(JSON.stringify(data)) } };
}

type HomeProps = {
  data: Todos;
};

export default function Home({ data }: HomeProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAdd = async () => {
    if (inputRef.current) {
      const response: Todo = await addTodo(inputRef.current.value);

      const newTodo = {
        ...response,
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
      };

      setTodos((todos) => {
        return [...todos, newTodo];
      });
    }
  };

  const handleDelete = async (id: number) => {
    deleteTodo(id);

    setTodos((todos) => {
      return [...todos.filter((item) => item.id !== id)];
    });
  };

  const handleChangeCompleted = async ({
    id,
    completed,
  }: {
    id: number;
    completed: boolean;
  }) => {
    const response: Todo = await changeTodoCompleted({ id, completed });

    setTodos((todos) => {
      return todos.map((value) => {
        if (value.id === id) return { ...value, completed };
        return value;
      });
    });
  };

  const [todos, setTodos] = useState<Todo[]>(data.todos);

  return (
    <>
      <Head>
        <title>HELEN&apos;S TODO LIST</title>
      </Head>
      <main>
        <span>Total: {todos.length}</span>

        <input ref={inputRef} type="text" />
        <button onClick={handleAdd}>ADD</button>

        {todos.length > 0 ? (
          <ul>
            {todos.map((value, index) => (
              <li key={value.id}>
                <button
                  onClick={() =>
                    handleChangeCompleted({
                      id: value.id,
                      completed: !value.completed,
                    })
                  }
                >
                  {value.completed ? `🅾️` : `❎`}
                </button>
                <button onClick={() => handleDelete(value.id)}>DELETE</button>
                <span>{value.todo}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div>TODO is null</div>
        )}
      </main>
    </>
  );
}
