import { HTMLCrawler } from 'kw-crawler';
import { Crawler } from './Crawler';
import { IFigure } from '../Figure';
import { createHash } from 'crypto';
import { URL } from 'url';

export class GoodSmileCrawler extends Crawler {
    protected async parseFigureListPage(): Promise<Array<string>> {
        const year = new Date().getFullYear();
        const url = `http://www.goodsmile.info/zh/products/category/scale/announced/${year}`;
        this.url = new URL(url);
        
        const crawler = new HTMLCrawler(this.url.href);
        crawler.setRule({
            name: 'figures_links',
            selector: '.hitBox > a',
            callback: links => links.map(i => links.eq(i).attr('href')).toArray(),
        });
        const results = await crawler.getResults({args: ['--no-sandbox']});
        return results['figures_links'];
    }
    protected async parseFigurePage(url: string): Promise<IFigure> {
        const crawler = new HTMLCrawler(url);
        crawler.setRule({
            name: 'name',
            selector: '#itemBox > div.itemInfo > h1',
            callback: selector => selector.text().trim(),
        });

        crawler.setRule({
            name: 'series',
            selector: '.detailBox dd:nth-child(4)',
            callback: selector => selector.text().trim(),
        });

        crawler.setRule({
            name: 'company',
            selector: '.detailBox dd:nth-child(6)',
            callback: selector => selector.text().trim(),
        });

        crawler.setRule({
            name: 'release_date',
            selector: '.detailBox dd.release_date',
            callback: selector => new Date(selector.text().trim()),
        });

        crawler.setRule({
            name: 'is_resale',
            selector: '.detailBox dd:nth-child(16)',
            callback: selector => selector.length === 1,
        });

        crawler.setRule({
            name: 'price',
            selector: '.detailBox div > dd',
            callback: selector => selector.text().replace(/\s/g, ''),
        });

        crawler.setRule({
            name: 'image',
            selector: '#itemZoom1 img.itemImg',
            callback: selector => this.url.protocol + selector.attr('src'),
        });

        crawler.setStatic({
            name: 'url',
            value: url,
        })

        crawler.setStatic({
            name: 'md5_url',
            value: createHash('md5').update(url).digest('hex'),
        })

        const figure = await crawler.getResults({args: ['--no-sandbox']});
        return figure;
    }
}
