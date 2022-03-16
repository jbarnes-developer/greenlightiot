import express from 'express'
import { ClassController } from './Class.controller';
import { IController } from './IController';

const PORT: number = 3000;

export class Server {
    public app: express.Application;
    public controllers: IController[] = [];

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        this.Initialize_Controllers();
        this.Listen();
    }

    private Initialize_Controllers(): void {
        this.app.get('/api/', (req, res) => {
            res.send('Hello World!')
        });

        this.controllers = [
            new ClassController()
        ];

        this.controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private Listen(): void {
        this.app.listen(PORT, () => {
            console.log(`App listening on the port ${PORT}`);
        });
    }
}