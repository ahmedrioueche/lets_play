import mongoose, { Document, Schema } from 'mongoose';

export interface OtpDocument extends Document {
  userId: string;
  code: string;
  expiresAt: Date;
}

const OtpSchema = new Schema<OtpDocument>({
  userId: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

const OtpModel = mongoose.models.Otp || mongoose.model<OtpDocument>('Otp', OtpSchema);

export default OtpModel;
