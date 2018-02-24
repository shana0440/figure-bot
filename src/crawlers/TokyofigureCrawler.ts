import { HTMLCrawler } from 'kw-crawler';
import { Crawler } from './Crawler';
import { IFigure } from '../Figure';
import { createHash } from 'crypto';
import { URL } from 'url';

export class TokyofigureCrawler extends Crawler {
    protected async parseFigureListPage(): Promise<Array<string>> {
        const url = `https://tokyofigure.jp/products/list.php?category_id=9&orderby=date&disp_number=50&pageno=1`;
        this.url = new URL(url);
        
        const crawler = new HTMLCrawler(this.url.href);
        crawler.setRule({
            name: 'figures_links',
            selector: '.thumbnail img',
            callback: links => links.map(i => (
                'https://tokyofigure.jp/products/detail.php?product_id=' + links.eq(i).attr('onclick').match(/\d+/).shift()
            )).toArray(),
        });
        const results = await crawler.getResults({args: ['--no-sandbox']});
        return results['figures_links'];
    }
    protected async parseFigurePage(url: string): Promise<IFigure> {
        const crawler = new HTMLCrawler(url);
        crawler.setRule({
            name: 'name',
            selector: '.title',
            callback: selector => selector.text().trim(),
        });

        crawler.setRule({
            name: 'series',
            selector: '#rightcolumn > div:nth-child(2) > dl.original > dd',
            callback: selector => selector.text().trim(),
        });

        crawler.setRule({
            name: 'company',
            selector: '#rightcolumn > div:nth-child(2) > dl.maker > dd > a',
            callback: selector => selector.text().trim(),
        });

        crawler.setRule({
            name: 'release_date',
            selector: '#rightcolumn > div:nth-child(2) > dl.sale_date > dd',
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
            selector: '.sale_price .price',
            callback: selector => selector.text().replace(/\s/g, ''),
        });

        crawler.setRule({
            name: 'image',
            selector: '.ad-image-wrapper_out .ad-image > img',
            callback: selector => this.url.origin + selector.attr('src'),
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
