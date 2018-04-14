import { IFigure } from "../Figure";
import { URL } from 'url';

export abstract class Crawler {
    protected url: URL;

    public async getFiguresURL(): Promise<string[]> {
        try {
            const figuresURL = await this.parseFigureListPage();
            return figuresURL;
        } catch (err) {
            console.error(this.constructor.name, err);
            return [];
        }
    }

    public async getFigures(urls: string[]): Promise<Array<IFigure>> {
        const figures: Array<IFigure> = [];
        for (let url of urls) {
            figures.push(await this.parseFigurePage(url));
        }
        return figures;
    }

    protected abstract async parseFigureListPage(): Promise<Array<string>>;
    protected abstract async parseFigurePage(url: string): Promise<IFigure>;
}