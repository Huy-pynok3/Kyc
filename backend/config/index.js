import dotenv from "dotenv";
dotenv.config();

export const config = {
    secretToken: process.env.SECRET_TOKEN,
};
