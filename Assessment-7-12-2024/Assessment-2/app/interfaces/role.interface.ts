import { Document } from "mongoose";

export interface IRole {
    role: "admin" | "user";
    roleDisplayName: string;
    rolegroup: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}