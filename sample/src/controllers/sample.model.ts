import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate";

const schema = new Schema({
  name: {
    required: [true, "Name is required."],
    type: String,
    unique: true,
  },
});

schema.plugin(paginate);

export default model("Sample", schema);
