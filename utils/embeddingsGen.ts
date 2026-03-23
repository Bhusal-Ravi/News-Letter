export async function getEmbedding(text:string) {
  const res = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nomic-embed-text", 
      prompt: text,
    }),
  });

  const data = await res.json();
  console.log(data)
  return data.embedding;
}

 getEmbedding("Hello my God, I am blessed by you and i will work on your direction. You guide me")