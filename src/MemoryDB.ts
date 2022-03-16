import { ClassModel } from "./Class.model";

// Used as a global static class
export class MemoryDB {
    public static classes: ClassModel[] = [];

    private constructor() {

    }
}