import { MemoryDB } from "./MemoryDB";

export interface Class {
    name: string;
    startDate: Date;
    students: Student[];
}

export interface Student {
    name: string;
    age: number;
}

export class ClassModel implements Class {
    private _name: string;
    private _startDate: Date;
    private _students: Student[] = [];

    public get name(): string { return this._name; }
    public get startDate(): Date { return this._startDate; }
    public get students(): Student[] { return this._students; }
    public get numStudents(): number { return this._students.length; }

    public set name(name: string) { this._name = name; }
    public set startDate(startDate: Date) { this._startDate = startDate; }

    private constructor() {
        // this._instance = this;
    }

    public static Create(name: string, startDate: Date): ClassModel {
        const myModel = new ClassModel();
        myModel.name = name;
        myModel.startDate = startDate;
        MemoryDB.classes.push(myModel);
        return myModel;
    }

    public static Get_All(): Class[] {
        return MemoryDB.classes;
    }

    public static Get_AllWithNumberOfStudents(): { name: string, startDate: Date, students: Student[], numStudents: number }[] {
        const classes = MemoryDB.classes;
        const classesWithNum: { name: string, startDate: Date, students: Student[], numStudents: number }[] = []
        for(let i = 0; i < classes.length; i++) {
            classesWithNum.push({
                name: classes[i].name,
                startDate: classes[i].startDate,
                students: classes[i].students,
                numStudents: classes[i].numStudents
            });
        }
        return classesWithNum;
    }

    public static Find_ByName(name: string): ClassModel {
        const myClass = MemoryDB.classes.find(c => c.name === name);
        if(myClass) {
            return myClass;
        }
        throw new Error('Class not found.');
    }

    public static Delete_ByName(name: string): boolean {
        const myClass = ClassModel.Find_ByName(name);
        if(myClass) {
            myClass.Delete(myClass);
            return true;
        }
        throw new Error('Class not found.');
    }

    public Delete(myClass: ClassModel): boolean {
        if(this.numStudents > 0) {
            throw new Error("Class is not empty.");
        }

        const myClassIndex = MemoryDB.classes.findIndex(c => c === this);
        if(myClassIndex > -1) {
            MemoryDB.classes.splice(myClassIndex, 1);
            return true;
        }

        throw new Error("Class not found in database.");
    }

    public Add_Student(name: string, age: number): void {
        this._students.push({
            name: name,
            age: age
        });
        this.Sort_StudentsByName();
    }

    public Remove_StudentByName(name: string): boolean {
        console.log(name);
        console.log(this._students);
        const studentIndex = this._students.findIndex(s => s.name === name);
        
        if(studentIndex > -1) {
            this._students.splice(studentIndex, 1);
            return true;
        }
        throw new Error("Student not found.");
    }

    public Sort_StudentsByName(): void {
        this._students.sort((a: Student, b: Student) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if(nameA < nameB) {
                return -1;
            }
            else if(nameA > nameB) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }
}