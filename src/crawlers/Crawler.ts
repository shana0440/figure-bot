import { FigureSchema } from "../Figure";
import { URL } from 'url';

export abstract class Crawler {
    protected url: URL;

    constructor(url) {
        this.url = new URL(url);
    }

    public async getFigures(): Promise<Array<FigureSchema>> {
        const productURLs = await this.parseFigureListPage();
        const figures: Array<FigureSchema> = [];
        for (let url of productURLs) {
            figures.push(await this.parseFigurePage(url));
        }
        return figures;
    }

    protected abstract async parseFigureListPage(): Promise<Array<string>>;
    protected abstract async parseFigurePage(url: string): Promise<FigureSchema>;
}