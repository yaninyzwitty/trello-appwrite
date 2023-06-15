import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request){
    const { todos } = await request.json();

    // openai integrate

    const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        n: 1,
        stream: false,
        messages: [
            {
                role: 'system',
                content: `When responding, welcome the user as Mr Witty and say welcome to the Witty Todo App!. Limit the response to 300 characters.`,
            },
            {
                role: 'user',
                content: `Hi there, provide a summary for the following todos. Count how many todos are in each category suchas To do, In progress and done, then tell the user to have a productive day! Here is the data ${JSON.stringify(todos)}`,
            }
        ]
    });


    const { data } = res;



    return NextResponse.json(data.choices[0].message)



}