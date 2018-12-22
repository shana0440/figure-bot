import { IFigure } from "../models/figure";
import { URL } from "url";

export abstract class Crawler {
  protected url: URL;

  // TODO: caller should handler error
  public abstract async getFiguresURL(): Promise<string[]>;

  // TODO: caller should handler error
  public abstract async getFigure(url: string): Promise<IFigure>;
}
