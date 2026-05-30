
import dotenv from "dotenv"
import path from "node:path"

dotenv.config({path : path.resolve(process.cwd(), ".env")})

const config = {
    port : Number(process.env.PORT)
}

export default config;