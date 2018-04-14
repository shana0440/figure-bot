import { HTMLCrawler } from 'kw-crawler';
import { Crawler } from './Crawler';
import { IFigure } from '../Figure';
import { createHash } from 'crypto';
import { URL } from 'url';

export class PulchraCrawler extends Crawler {
    protected async parseFigureListPage(): Promise<Array<string>> {
        const url = `https://pulc.jp/category/select/cid/312/page/1/mode/2/language/ja`;
        this.url = new URL(url);
        
        const crawler = new HTMLCrawler(this.url.href);
        crawler.setRule({
            name: 'figures_links',
            selector: '.item .image > a',
            callback: links => links.map(i => links.eq(i).attr('href')).toArray(),
        });
        const results = await crawler.getResults({args: ['--no-sandbox']});
        return results['figures_links'];
    }

    protected async parseFigurePage(url: string): Promise<IFigure> {
        const crawler = new HTMLCrawler(url);
        crawler.setRule({
            name: 'name',
            selector: '.description',
            callback: selector => (
                selector.text().match(/【キャラ名】(.*)\B/)[1] || ''
            ),
        });

        crawler.setRule({
            name: 'series',
            selector: '.description',
            callback: selector => {
                const result = selector.text().match(/【原作名】(.*)\B/);
                return result ? result[1] : '';
            },
        });

        crawler.setStatic({
            name: 'company',
            value: 'PULCHRA',
        });

        crawler.setRule({
            name: 'release_date',
            selector: '.description',
            callback: selector => {
                const date = new Date(
                  selector
                    .text()
                    .match(/【発売日】(.*)\B/)[1]
                    .substr(0, 7)
                    .replace(/年|月/g, '/')
                )
                return isNaN(date.getTime()) ? new Date('1970/01/01') : date
            },
        });

        crawler.setRule({
            name: 'is_resale',
            selector: '.textFrame h1',
            callback: selector => selector.text().indexOf('再販') !== -1
        });

        crawler.setRule({
            name: 'price',
            selector: '.price > h3',
            callback: selector => selector.text(),
        });

        crawler.setRule({
            name: 'image',
            selector: '#zoom_09',
            callback: selector => `${this.url.origin}/${selector.attr('src')}`,
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
