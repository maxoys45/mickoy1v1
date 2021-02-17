import mongoose from 'mongoose'

const MapsSchema = new mongoose.Schema({
  csmap: {
    type: String,
    required: true,
  },
})

export const Map = mongoose.model('Map', MapsSchema)