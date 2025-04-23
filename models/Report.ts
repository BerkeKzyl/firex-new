import mongoose from 'mongoose';


const ReportSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  dateTime: String,
  image: String, // base64 string
  comment: {
    type: String,
    maxlength: 120,
  },
});

delete mongoose.models.Report;
export const Report = mongoose.model('Report', ReportSchema);
