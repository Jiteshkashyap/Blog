import express, { urlencoded } from "express"
import cors from"cors"
import dotenv from "dotenv"
import connectDB from "./database/db.js"
import userRoute from"./routes/userRoutes.js"
import blogRoute from"./routes/blogRoutes.js"
import cookieParser from "cookie-parser"
import commentRoute from './routes/commentRoutes.js'
import path from "path"


dotenv.config()
const app = express()

const PORT= process.env.PORT ||3000

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const _dirname= path.resolve()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

app.use("/api/v1/user", userRoute)
app.use("/api/v1/blog", blogRoute)
app.use("/api/v1/comment",commentRoute)

app.use(express.static(path.join(_dirname , "/frontend/dist")))
// app.get("*" , (_ ,res)=>{
//     res.sendFile(path.resolve(_dirname ,"frontend", "dist" , "index.html"))
// })

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

connectDB();

app.listen(PORT , ()=>{
    console.log(`"Server is running at" ${PORT}`)
})