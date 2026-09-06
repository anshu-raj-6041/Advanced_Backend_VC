import express, { text } from "express"
import dotenv from "dotenv"
import { GoogleGenAI } from "@google/genai";
dotenv.config()
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { Annotation, StateGraph } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq"

const app = express();
const port = 5000
app.use(express.json())

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// })

// app.post("/ai", async (req, res) => {
//     const { input } = req.body
//     const response = await ai.models.generateContent({
//         model: "gemini-3.5-flash",
//         contents: [
//             {
//                 role: "system",
//                 parts: [{ text: "You are assistant and ur name is Anshu, if you don't know answer then don't give any answer" }]
//             },
//             {
//                 role: "user",
//                 parts: [{ text: input }]
//             }


//         ]
//     })
//     return res.status(200).json({ "ai:": response.text })
// })



// with LangChain
const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    // temp km => serious
    // temp jda => creative
    temperature: 0.7,
    maxOutputTokens: 100,
    maxRetries: 2
})


// custom state
const State = Annotation.Root({
    prompt: Annotation,
    aiMsg: Annotation
})

const callLLM = async (state) => {
    console.log("state:", state);

    const response = await llm.invoke([
        {
            role: "system",
            content: "You are assistant"
        },
        {
            role: "human",
            content: state.prompt
        }
    ])
    return { aiMsg: response.content }


}

// graph
const graph = new StateGraph(State)
    .addNode("agent", callLLM)
    .addEdge("__start__", "agent")
    .addEdge("agent", "__end__")
    .compile()







app.post("/ai", async (req, res) => {
    const { input } = req.body

    const response = await graph.invoke({ prompt: input })
    console.log(response)

    return res.status(200).json({ ai: response?.aiMsg ?? "" })
})



app.get("/", (req, res) => {
    return res.json({ message: "Hello from level4" })

})
app.listen(port, () => {

    console.log("Server Started");

})