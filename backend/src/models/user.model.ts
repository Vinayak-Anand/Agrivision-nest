import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  gender: string;
  contact: {
    phone: string;
    whatsapp: string;
  };
  dateOfBirth: Date;
  address: {
    present: {
      houseNumber: string;
      street: string;
      locality: string;
      district: string;
      state: string;
      country: string;
      zipCode: string;
    };
    permanent: {
      houseNumber: string;
      street: string;
      locality: string;
      district: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  profilePicture: string;
  college: string; // Name of the user's college
  department: string; // Department of the user
  designation: string; // User's designation (e.g., Student, Professor)
  category: string; // Category of the user (e.g., Student, Professional)
  linkedIn: string; // LinkedIn profile link
}

const UserSchema: Schema = new Schema(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    contact: {
      phone: { type: String, required: true },
      whatsapp: { type: String },
    },
    dateOfBirth: { type: Date, required: true },
    address: {
      present: {
        houseNumber: { type: String, required: true },
        street: { type: String, required: true },
        locality: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
      },
      permanent: {
        houseNumber: { type: String, required: true },
        street: { type: String, required: true },
        locality: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
      },
    },
    profilePicture: { type: String },
    college: { type: String, required: true }, // Mandatory field
    department: { type: String, required: true }, // Mandatory field
    designation: { type: String, required: true }, // Mandatory field
    category: { type: String, required: true }, // Mandatory field
    linkedIn: { type: String, required: false }, // Optional field
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
