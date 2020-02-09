import { resolve } from 'path';

import * as Lowdb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';

import { Config } from './config/Config';
import { UserSchema, UserRepository } from './repositories/UserRepository';
import { FigureSchema, FigureRepository } from './repositories/FigureRepository';
import { LineFigureSender } from './senders/LineFigureSender';
import { AlphamaxCrawler } from './crawlers/AlphamaxCrawler';
import { AlterCrawler } from './crawlers/AlterCrawler';
import { AoshimaCrawler } from './crawlers/AoshimaCrawler';
import { FnexCrawler } from './crawlers/FnexCrawler';
import { GoodSmileCrawler } from './crawlers/GoodSmileCrawler';
import { KotobukiyaCrawler } from './crawlers/KotobukiyaCrawler';
import { PulchraCrawler } from './crawlers/PulchraCrawler';
import { TokyofigureCrawler } from './crawlers/TokyofigureCrawler';
import { BroccoliCrawler } from './crawlers/BroccoliCrawler';
import { HobbyjapanCrawler } from './crawlers/HobbyjapanCrawler';
import { HakomusuCrawler } from './crawlers/HakomusuCrawler';
import { Request } from './request/Request';

type Schema = UserSchema & FigureSchema;

export class Container {
  config: Config;
  private db: Lowdb.LowdbSync<Schema>;
  private userRepo?: UserRepository;
  private figureRepo?: FigureRepository;
  private lineSender?: LineFigureSender;
  private req?: Request;
  private crawlers: {
    alphamax?: AlphamaxCrawler;
    alter?: AlterCrawler;
    aoshima?: AoshimaCrawler;
    fnex?: FnexCrawler;
    goodsmile?: GoodSmileCrawler;
    kotobukiya?: KotobukiyaCrawler;
    pulchra?: PulchraCrawler;
    tokyofigure?: TokyofigureCrawler;
    broccoli?: BroccoliCrawler;
    hobbyjapan?: HobbyjapanCrawler;
    hakomusu?: HakomusuCrawler;
  } = {};

  constructor(config: Config) {
    this.config = config;
    const file = new FileSync(resolve(__dirname, '../db.json'));
    this.db = Lowdb(file);
  }

  get userRepository(): UserRepository {
    if (!this.userRepo) {
      this.userRepo = new UserRepository(this.db);
    }
    return this.userRepo;
  }

  get figureRepository(): FigureRepository {
    if (!this.figureRepo) {
      this.figureRepo = new FigureRepository(this.db);
    }
    return this.figureRepo;
  }

  get lineFigureSender(): LineFigureSender {
    if (!this.lineSender) {
      this.lineSender = new LineFigureSender(this.config, this.userRepository);
    }
    return this.lineSender;
  }

  get request(): Request {
    if (!this.req) {
      this.req = new Request();
    }
    return this.req;
  }

  get alphamaxCrawler(): AlphamaxCrawler {
    if (!this.crawlers.alphamax) {
      this.crawlers.alphamax = new AlphamaxCrawler(this.request, this.figureRepository);
    }
    return this.crawlers.alphamax;
  }

  get alterCrawler(): AlterCrawler {
    if (!this.crawlers.alter) {
      this.crawlers.alter = new AlterCrawler(this.request, this.figureRepository);
    }
    return this.crawlers.alter;
  }

  get aoshimaCrawler(): AoshimaCrawler {
    if (!this.crawlers.aoshima) {
      this.crawlers.aoshima = new AoshimaCrawler(this.request, this.figureRepository);
    }
    return this.crawlers.aoshima;
  }

  get fnexCrawler(): FnexCrawler {
    if (!this.crawlers.fnex) {
      this.crawlers.fnex = new FnexCrawler(this.request, this.figureRepository);
    }
    return this.crawlers.fnex;
  }

  get goodsmileCrawler(): GoodSmileCrawler {
    if (!this.crawlers.goodsmile) {
      this.crawlers.goodsmile = new GoodSmileCrawler(this.request, this.figureRepository);
    }
    return this.crawlers.goodsmile;
  }

  get kotobukiyaCrawler(): KotobukiyaCrawler {
    if (!this.crawlers.kotobukiya) {
      this.crawlers.kotobukiya = new KotobukiyaCrawler(this.request, this.figureRepository);
    }
    return this.crawlers.kotobukiya;
  }

  get pulchraCrawler(): PulchraCrawler {
    if (!this.crawlers.pulchra) {
      this.crawlers.pulchra = new PulchraCrawler(this.request, this.figureRepository);
    }
    return this.crawlers.pulchra;
  }

  get tokyofigureCrawler(): TokyofigureCrawler {
    if (!this.crawlers.tokyofigure) {
      this.crawlers.tokyofigure = new TokyofigureCrawler(this.request, this.figureRepository);
    }
    return this.crawlers.tokyofigure;
  }

  get broccoliCrawler(): BroccoliCrawler {
    if (!this.crawlers.broccoli) {
      this.crawlers.broccoli = new BroccoliCrawler(this.request, this.figureRepository);
    }
    return this.crawlers.broccoli;
  }

  get hobbyjapanCrawler(): HobbyjapanCrawler {
    if (!this.crawlers.hobbyjapan) {
      this.crawlers.hobbyjapan = new HobbyjapanCrawler(this.request, this.figureRepository);
    }
    return this.crawlers.hobbyjapan;
  }

  get hakomusuCrawler(): HakomusuCrawler {
    if (!this.crawlers.hakomusu) {
      this.crawlers.hakomusu = new HakomusuCrawler(this.request, this.figureRepository);
    }
    return this.crawlers.hakomusu;
  }
}
