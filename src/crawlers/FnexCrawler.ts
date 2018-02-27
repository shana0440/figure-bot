import { HTMLCrawler } from 'kw-crawler';
import { Crawler } from './Crawler';
import { IFigure } from '../Figure';
import { createHash } from 'crypto';
import { URL } from 'url';

export class FnexCrawler extends Crawler {
    protected async parseFigureListPage(): Promise<Array<string>> {
        const url = `https://fnex.jp/products/search.php?categories%5B%5D=14`;
        this.url = new URL(url);
        
        const crawler = new HTMLCrawler(this.url.href);
        crawler.setRule({
            name: 'figures_links',
            selector: '.item',
            callback: links => links.map(i => (
                this.url.origin + links.eq(i).attr('href')
            )).toArray(),
        });
        const results = await crawler.getResults({args: ['--no-sandbox']});
        return results['figures_links'];
    }

    protected async parseFigurePage(url: string): Promise<IFigure> {
        const crawler = new HTMLCrawler(url);
        crawler.setRule({
            name: 'name',
            selector: '.name',
            callback: selector => (
                selector.text().replace(/[^\s]+\s/, '').trim()
            ),
        });

        crawler.setRule({
            name: 'series',
            selector: '.name',
            callback: selector => (
                selector.text().match(/([^\s]+)/).shift()
            ),
        });

        crawler.setStatic({
            name: 'company',
            value: 'F:NEX',
        });

        crawler.setRule({
            name: 'release_date',
            selector: '#form1 > section:nth-child(6) > div > h4',
            callback: selector => {
                const date = new Date(selector.text().trim().substr(0, 7).replace(/年|月/g, '/'))
                return isNaN(date.getTime()) ? new Date('1970/01/01') : date
            },
        });

        // no resale information yet
        crawler.setStatic({
            name: 'is_resale',
            value: false,
        });

        crawler.setRule({
            name: 'price',
            selector: '#form1 > section.pdetail_slider.in-wrap > div.text > div.price > p.num',
            callback: selector => selector.text().replace(/\s/g, ''),
        });

        crawler.setRule({
            name: 'image',
            selector: '#tlarge > div.active > img',
            callback: selector => selector.attr('src'),
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
