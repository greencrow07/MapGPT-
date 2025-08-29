import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    question : {
        type : String,
        required : true
    }, 
    answer : {
        type : String, 
        required : true,
    }
})

const NodeSchema = new mongoose.Schema(
  {
    id: String,
    type: String,
    data: ChatSchema,
    position: {
      x: Number,
      y: Number,
    },
  },
  { _id: false }
);

const EdgeSchema = new mongoose.Schema(
  {
    id: String,
    source: String,
    target: String,
    sourceHandle: String,
    targetHandle: String,
    label: String,
    type: String,
    animated: Boolean,
    style: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    markerEnd: {
      type: new mongoose.Schema(
        {
          type: String,
          color: String,
        },
        { _id: false }
      ),
    },
  },
  { _id: false }
);

const FlowSchema = new mongoose.Schema({
  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nodes: [NodeSchema],
  edges: [EdgeSchema],  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Flow = mongoose.model("Flow", FlowSchema);

export default Flow; 