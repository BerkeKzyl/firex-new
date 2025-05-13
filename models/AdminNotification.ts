import mongoose, { Document, Model } from 'mongoose';

export interface IAdminNotification extends Document {
  email: string;
  isActive: boolean;
  createdAt: Date;
}

const AdminNotificationSchema = new mongoose.Schema<IAdminNotification>({
  email: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const AdminNotification: Model<IAdminNotification> =
  mongoose.models.AdminNotification as Model<IAdminNotification> ||
  mongoose.model<IAdminNotification>('AdminNotification', AdminNotificationSchema);

export default AdminNotification;