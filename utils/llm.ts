import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { dedent } from "ts-dedent";
import { z } from "zod";
import { supabase } from "./supabase";

const model = new BedrockChat({
  model: process.env.MODEL_ID,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  temperature: 0.7,
});

const topics = z.object({
  category: z.string().describe("カテゴリ"),
  majorityWord: z.string().describe("村人のお題"),
  wolfWord: z.string().describe("人狼のお題"),
});
type Topics = z.infer<typeof topics>;

export default async function callModel(category: string, roomId: string) {
  const history = await getHistory(roomId);
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      dedent`
      ワードウルフのお題を作成してください
      人物やキャラクターがカテゴリの場合、その名前を優先的に使ってください
      `,
    ],
    [
      "user",
      dedent`
      {category} に関するお題を入力してください
      ${history.length > 0 ? "以下の既存のお題以外を出力してください" : ""}
      ${history
        .map((h) => `村人: ${h.majority_word}, 人狼: ${h.wolf_word}`)
        .join("\n")}
      `,
    ],
  ]);

  const structuredLlm = model.withStructuredOutput(topics);
  const chain = prompt.pipe(structuredLlm);

  const response = await chain.invoke({ category }).catch((e) => {
    console.error(e);
    return null;
  });
  if (!response) return null;
  await saveHistory(response, roomId);

  return response;
}

async function getHistory(roomId: string) {
  return await supabase
    .from("topics")
    .select()
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(10)
    .then((res) => {
      if (res.error) {
        return [];
      }
      return res.data;
    });
}

async function saveHistory(topics: Topics, roomId: string) {
  return await supabase.from("topics").insert({
    room_id: roomId,
    category: topics.category,
    majority_word: topics.majorityWord,
    wolf_word: topics.wolfWord,
  });
}
