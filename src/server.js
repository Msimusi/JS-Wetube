import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

// 이 아래에 각종 파일과 폴더가 코딩될 예정임

//  이 위에 각종 파일과 폴더가 코딩될 예정임

// 서버와의 연결? 리슨?
const handleListening = () =>
  console.log(`🚑Server listening on port http://localhost:${PORT}🚑`);

app.listen(PORT, handleListening);
