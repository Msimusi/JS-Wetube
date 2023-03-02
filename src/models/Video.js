import mongoose from "mongoose";

// // 함수를 생성하는 경우.
// export const formatHashtags = (hashtags) => {
//   return hashtags
//     .split(",")
//     .map((word) =>
//       word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`
//     );
// };

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    maxLength: 30,
  },
  fileUrl: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

// // MiddleWare가 저장하기 전에 포맷을 잡는 경우
// videoSchema.pre("save", async function () {
//   this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((word) =>
//       word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`
//     );
// });

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) =>
      word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`
    );
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
