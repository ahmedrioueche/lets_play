import { Game } from '@/types/game';
import mongoose, { Document, Schema } from 'mongoose';

// Define IGame as an intersection type to avoid interface extension conflicts
export type IGame = Game & Document;

const GameSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    location: { type: String, required: false },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    date: { type: String, required: true }, // Store as string (ISO date) for simplicity with HTML date input
    time: { type: String, required: true }, // Store as string for simplicity with HTML time input
    currentPlayers: { type: Number, required: true, default: 0 },
    maxPlayers: { type: Number, required: true },
    ageMin: { type: Number, required: false, min: 13, max: 100 },
    ageMax: { type: Number, required: false, min: 13, max: 100 },
    status: {
      type: String,
      enum: Object.values(['open', 'full', 'cancelled', 'completed']),
      default: 'open',
    },
    sport: {
      type: String,
      enum: Object.values(['football', 'basketball', 'tennis', 'volleyball', 'badminton']),
      required: true,
    },
    skillLevel: {
      type: String,
      enum: Object.values(['beginner', 'intermediate', 'advanced']),
      required: true,
    },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, default: 0 },
    image: { type: String },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const GameModel = (mongoose.models.Game ||
  mongoose.model<IGame>('Game', GameSchema)) as mongoose.Model<IGame>;

export default GameModel;
