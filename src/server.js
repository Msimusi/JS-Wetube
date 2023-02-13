import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");
app.use(logger);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// 이 아래에 각종 파일과 폴더가 코딩될 예정임

//  이 위에 각종 파일과 폴더가 코딩될 예정임

// 서버와의 연결? 리슨?
const handleListening = () =>
  console.log(`🚑Server listening on port http://localhost:${PORT}🚑`);

app.listen(PORT, handleListening);
