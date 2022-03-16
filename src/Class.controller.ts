import { Router, Request, Response, NextFunction } from 'express';
import { Class, ClassModel } from './Class.model';
import { IController } from './IController';

export class ClassController implements IController {
    public path: string = "/class";
    public router: Router = Router();

    constructor() {
        this.Init_Routes();
    }

    private Init_Routes(): void {
        this.router.get(`${this.path}/`, this.Get_All);
        this.router.post(`${this.path}/create`, this.Create);
        this.router.get(`${this.path}/findByName/:name`, this.Find_ByName);
        this.router.delete(`${this.path}/removeByName/:name`, this.Delete_ByName);
        this.router.post(`${this.path}/addStudent/:className`, this.Add_StudentToClass);
        this.router.delete(`${this.path}/removeStudent/:className/:studentName`, this.Remove_StudentFromClass);
    }

    private Create = async(request: Request, response: Response): Promise<void> => {
        try {
            console.log(request.body)
            this.Validate_Name(request.body.name);
            this.Validate_StartDate(request.body.startDate);
        }
        catch(err: any) {
            response.status(422);
            console.log(err);
            response.send("Invalid Input.");
            return;
        }

        try {
            const myClass = ClassModel.Create(request.body.name, new Date(request.body.startDate));
            response.status(201);
            response.send(<Class>myClass);
        }
        catch(err: any) {
            response.status(500);
            console.log(err);
            response.send("Cannot create new class.");
        }
    }

    private Find_ByName = async(request: Request, response: Response): Promise<void> => {
        try {
            this.Validate_Name(request.params.name);
        }
        catch(err: any) {
            response.status(422);
            response.send("Invalid Input.");
            return;
        }

        try {
            const myClass = ClassModel.Find_ByName(request.params.name);
            response.status(200);
            response.json(<Class>myClass);
        }
        catch(err: any) {
            response.status(404);
            response.send(err.message);
        }
    }

    private Get_All = async(request: Request, response: Response): Promise<void> => {
        console.log("Get_All");
        try {
            const myClasses = ClassModel.Get_AllWithNumberOfStudents();
            response.status(200);
            response.json(myClasses);
        }
        catch(err: any) {
            response.status(500);
            response.send(err.message);
        }
    }

    private Delete_ByName = async(request: Request, response: Response): Promise<void> => {
        console.log(request.params);

        try {
            this.Validate_Name(request.params.name);
        }
        catch(err: any) {
            response.status(422);
            response.send("Invalid Input.");
            return;
        }

        try {
            ClassModel.Delete_ByName(request.params.name);
            response.status(200);
            response.send("success");
        }
        catch(err: any) {
            response.status(500);
            console.log(err);
            response.send(err.message);
        }
    }

    private Add_StudentToClass = async(request: Request, response: Response): Promise<void> => {
        try {
            this.Validate_Name(request.params.className);
            this.Validate_Name(request.body.name);
            this.Validate_Age(request.body.age);
        }
        catch(err: any) {
            response.status(422);
            response.send("Invalid Input.");
            return;
        }

        try {
            const myClass = ClassModel.Find_ByName(request.params.className);
            myClass.Add_Student(request.body.name, parseInt(request.body.age));
            response.status(200);
            response.send("success");
        }
        catch(err: any) {
            response.status(500);
            response.send(err.message);
        }
    }

    private Remove_StudentFromClass = async(request: Request, response: Response): Promise<void> => {
        try {
            this.Validate_Name(request.params.className);
            this.Validate_Name(request.params.studentName);
        }
        catch(err: any) {
            response.status(422);
            response.send("Invalid Input.");
            return;
        }

        try {
            const myClass = ClassModel.Find_ByName(request.params.className);
            myClass.Remove_StudentByName(request.params.studentName);
            response.status(200);
            response.send("success");
        }
        catch(err: any) {
            response.status(500);
            response.send(err.message);
        }
    }

    private Validate_Name(name?: string): boolean {
        if(!name) {
            throw new Error("Name is required");
        }

        if(typeof(name) === "string") {
            return true;
        } 

        throw new Error("Name must be of string.")
    }

    private Validate_StartDate(date?: string): boolean {
        if(!date) {
            throw new Error("StartDate is required.");
        }

        const result = Date.parse(date);
        if(isNaN(result)) {
            throw new Error("StartDate must be a valid date format.");
        }

        return true;
    }

    private Validate_Age(age?: string): boolean {
        if(!age) {
            throw new Error("Age is required.");
        }

        if(isNaN(Number(age))) {
            throw new Error("Age must be a number.");
        }

        return true;
    }
}