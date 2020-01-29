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
import { HTMLRequest } from './request/HTMLRequest';

type Schema = UserSchema & FigureSchema;

export class Container {
  config: Config;
  private db: Lowdb.LowdbSync<Schema>;
  private userRepo?: UserRepository;
  private figureRepo?: FigureRepository;
  private lineSender?: LineFigureSender;
  private htmlReq?: HTMLRequest;
  private crawlers: {
    alphamax?: AlphamaxCrawler;
    alter?: AlterCrawler;
    aoshima?: AoshimaCrawler;
    fnex?: FnexCrawler;
    goodsmile?: GoodSmileCrawler;
    kotobukiya?: KotobukiyaCrawler;
    pulchra?: PulchraCrawler;
    tokyofigure?: TokyofigureCrawler;
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

  get htmlRequest(): HTMLRequest {
    if (!this.htmlReq) {
      this.htmlReq = new HTMLRequest();
    }
    return this.htmlReq;
  }

  get alphamaxCrawler(): AlphamaxCrawler {
    if (!this.crawlers.alphamax) {
      this.crawlers.alphamax = new AlphamaxCrawler(this.htmlRequest, this.figureRepository);
    }
    return this.crawlers.alphamax;
  }

  get alterCrawler(): AlterCrawler {
    if (!this.crawlers.alter) {
      this.crawlers.alter = new AlterCrawler(this.htmlRequest, this.figureRepository);
    }
    return this.crawlers.alter;
  }

  get aoshimaCrawler(): AoshimaCrawler {
    if (!this.crawlers.aoshima) {
      this.crawlers.aoshima = new AoshimaCrawler(this.htmlRequest, this.figureRepository);
    }
    return this.crawlers.aoshima;
  }

  get fnexCrawler(): FnexCrawler {
    if (!this.crawlers.fnex) {
      this.crawlers.fnex = new FnexCrawler(this.htmlRequest, this.figureRepository);
    }
    return this.crawlers.fnex;
  }

  get goodsmileCrawler(): GoodSmileCrawler {
    if (!this.crawlers.goodsmile) {
      this.crawlers.goodsmile = new GoodSmileCrawler(this.htmlRequest, this.figureRepository);
    }
    return this.crawlers.goodsmile;
  }

  get kotobukiyaCrawler(): KotobukiyaCrawler {
    if (!this.crawlers.kotobukiya) {
      this.crawlers.kotobukiya = new KotobukiyaCrawler(this.htmlRequest, this.figureRepository);
    }
    return this.crawlers.kotobukiya;
  }

  get pulchraCrawler(): PulchraCrawler {
    if (!this.crawlers.pulchra) {
      this.crawlers.pulchra = new PulchraCrawler(this.htmlRequest, this.figureRepository);
    }
    return this.crawlers.pulchra;
  }

  get tokyofigureCrawler(): TokyofigureCrawler {
    if (!this.crawlers.tokyofigure) {
      this.crawlers.tokyofigure = new TokyofigureCrawler(this.htmlRequest);
    }
    return this.crawlers.tokyofigure;
  }
}
