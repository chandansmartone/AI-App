import { auth } from "@clerk/nextjs";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {NextResponse} from "next/server"

const apiKey=process.env.API_KEY;
console.log(apiKey);

const openai = new OpenAI({
    apiKey:apiKey,
  });

const instructionMessage: ChatCompletionMessageParam = {
  role: "system",
  content: "Answer questions as short and quickly as possible. You must do it under 75 tokens."
}
export async function POST(req: Request) {
    try {
      // check for user
      const { userId } = auth();
      const body = await req.json();
      const { messages } = body;
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      
  
      // check for openAi Key
      if (!openai.apiKey) {
        return new NextResponse("OpenAI Api Key not Configured", { status: 500 });
      }
  // check for messages
      if (!messages) {
        return new NextResponse("Messages are required", { status: 400 });
      }
  
    //   const freeTrial = await checkApiLimit()
  
    //   if(!freeTrial) {
    //     return new NextResponse("Free trial is expired", {status: 403})
    //   }
  
      // Get response
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [instructionMessage, ...messages]
      });
  
  
     
  
      return NextResponse.json(response.choices[0].message);
    } catch (error) {
      console.log('[CONVERSATION_ERROR]', error);
  
      return new NextResponse("Internal Error", { status: 500 });
    }
  }