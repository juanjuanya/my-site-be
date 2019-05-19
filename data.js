const mongoose =  require('mongoose')
const Schema = mongoose.Schema  //命名空间

const DataSchema = new Schema(
  {
    id: Number,
    message: String
  },
  { timestamps: true}
)

module.exports = mongoose.model("Data", DataSchema)  //创建Data表

