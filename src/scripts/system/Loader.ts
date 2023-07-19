import { Assets, Texture } from 'pixi.js';
import { Config } from './../game/Config';

export class CustomLoader {
  assets: typeof Assets;
  config: typeof Config;
  resources: string[];

  constructor(assets: typeof Assets, config: typeof Config) {
    this.assets = assets;
    this.config = config;
    this.resources = [];
  }

  preload(): Promise<Record<string, Texture>> {
    for (const asset of this.config.assets) {
      const key = this.extractKey(asset.key);

      if (this.hasImageExtension(asset.key)) {
        this.assets.add(
          key,
          asset.data,
        );
        this.resources.push(key);
      }
    }

    return this.assets.load(this.resources);
  }

  private extractKey(assetKey: string): string {
    const fileName = assetKey.substring(assetKey.lastIndexOf('/') + 1);
    return fileName.substring(0, fileName.indexOf('.'));
  }

  private hasImageExtension(assetKey: string): boolean {
    const imageExtensions = ['.png', '.jpg'];
    return imageExtensions.some(extension => assetKey.includes(extension));
  }
}

