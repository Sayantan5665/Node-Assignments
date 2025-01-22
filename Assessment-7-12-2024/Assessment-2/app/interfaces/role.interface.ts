import { Document } from "mongoose";

export interface IRole {
    role: "admin" | "student" | "teacher";
    roleDisplayName: string;
    rolegroup: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}