import { IFigure } from "../Figure";
import { URL } from 'url';

export abstract class Crawler {
    protected url: URL;

    public async getFigures(): Promise<Array<IFigure>> {
        const productURLs = await this.parseFigureListPage();
        const figures: Array<IFigure> = [];
        for (let url of productURLs) {
            figures.push(await this.parseFigurePage(url));
        }
        return figures;
    }

    protected abstract async parseFigureListPage(): Promise<Array<string>>;
    protected abstract async parseFigurePage(url: string): Promise<IFigure>;
}