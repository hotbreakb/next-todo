import Head from "next/head";

export default function Home() {
  const getGoals = async () => {
    await fetch("https://next-todo.com/goals")
      .then((res) => {
        console.log("success");
        return res.json();
      })
      .catch((error) => {
        console.log("error");
        return error;
      });
  };

  getGoals();

  return (
    <>
      <Head>
        <title>HELEN&apos;S TODO LIST</title>
      </Head>
      <main></main>
    </>
  );
}
