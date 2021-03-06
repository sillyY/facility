import * as path from 'path'
import * as _ from 'lodash'
import {
  workspace,
  WorkspaceConfiguration,
  ExtensionContext,
  EventEmitter,
  ConfigurationChangeEvent,
  Event,
  Uri,
} from 'vscode'

export interface Config {
  workspaceFolder: string | null
  keyword: object | null
}

export interface ConfigurationWillChangeEvent {
  change: ConfigurationChangeEvent
  transform?(e: ConfigurationChangeEvent): ConfigurationChangeEvent
}

export const extensionId = 'facility'
export const extensionQualifiedId = `sillyy.${extensionId}`

export class Configuration {
  static configure(ctx: ExtensionContext) {
    // 配置项加上防抖，否则input输出会频繁触发
    ctx.subscriptions.push(
      workspace.onDidChangeConfiguration(
        _.debounce(configuration.onConfigurationChanged, 250),
        configuration
      )
    )
  }

  private _onDidChange = new EventEmitter<ConfigurationChangeEvent>()
  get onDidChange(): Event<ConfigurationChangeEvent> {
    return this._onDidChange.event
  }

  private _onWillChange = new EventEmitter<ConfigurationWillChangeEvent>()
  get onWillChange(): Event<ConfigurationWillChangeEvent> {
    return this._onWillChange.event
  }

  private getWorkspaceConfiguration(): WorkspaceConfiguration {
    return workspace.getConfiguration('facility')
  }
  private getWorkspaceFolder(): string {
    return this.getWorkspaceConfiguration().get<string>('workspaceFolder', '')
  }
  private getAppFolder(): string {
    return this.getWorkspaceConfiguration().get<string>('appFolder', '')
  }

  private userHomeFolder(): string {
    return process.env.HOME || process.env.USERPROFILE || ''
  }

  /**
   * @description: 获取插件首页目录
   * @return: 插件首页目录-带隐藏.tl
   */
  public homeFolder(): string {
    return path.join(this.getWorkspaceFolder() || this.userHomeFolder(), '.fl')
  }

  public get homeOriginFolder(): string {
    return path.join(this.userHomeFolder(), '.fl')
  }

  /**
   * @description: 获取插件首页目录
   * @return: 插件首页目录-不带隐藏.tl
   */
  public get appFolder(): string {
    return path.join(
      this.homeFolder(),
      this.getAppFolder() || 'facility-library'
    )
  }

  public get appOriginFolder(): string {
    return path.join(
      this.homeOriginFolder,
      this.getAppFolder() || 'facility-library'
    )
  }

  public get defaultFile(): string {
    return path.join(this.homeFolder(), '.prohibit.js')
  }

  private onConfigurationChanged(e: ConfigurationChangeEvent) {
    const evt: ConfigurationWillChangeEvent = {
      change: e,
    }
    this._onWillChange.fire(evt)

    if (evt.transform !== undefined) {
      e = evt.transform(e)
    }

    this._onDidChange.fire(e)
  }

  readonly initializingChangeEvent: ConfigurationChangeEvent = {
    affectsConfiguration: () => true,
  }

  initializing(e: ConfigurationChangeEvent) {
    return e === this.initializingChangeEvent
  }

  get(): Config
  get<S1 extends keyof Config>(
    s1: S1,
    resource?: Uri | null,
    defaultValue?: Config[S1]
  ): Config[S1]
  get<S1 extends keyof Config, S2 extends keyof Config[S1]>(
    s1: S1,
    s2: S2,
    resource?: Uri | null,
    defaultValue?: Config[S1][S2]
  ): Config[S1][S2]
  get<
    S1 extends keyof Config,
    S2 extends keyof Config[S1],
    S3 extends keyof Config[S1][S2]
  >(
    s1: S1,
    s2: S2,
    s3: S3,
    resource?: Uri | null,
    defaultValue?: Config[S1][S2][S3]
  ): Config[S1][S2][S3]
  get<
    S1 extends keyof Config,
    S2 extends keyof Config[S1],
    S3 extends keyof Config[S1][S2],
    S4 extends keyof Config[S1][S2][S3]
  >(
    s1: S1,
    s2: S2,
    s3: S3,
    s4: S4,
    resource?: Uri | null,
    defaultValue?: Config[S1][S2][S3][S4]
  ): Config[S1][S2][S3][S4]
  get<T>(...args: any[]): T {
    let section: string | undefined
    let resource: Uri | null | undefined
    let defaultValue: T | undefined
    if (args.length > 0) {
      section = args[0]
      if (typeof args[1] === 'string') {
        section += `.${args[1]}`
        if (typeof args[2] === 'string') {
          section += `.${args[2]}`
          if (typeof args[3] === 'string') {
            section += `.${args[3]}`
            resource = args[4]
            defaultValue = args[5]
          } else {
            resource = args[3]
            defaultValue = args[4]
          }
        } else {
          resource = args[2]
          defaultValue = args[3]
        }
      } else {
        resource = args[1]
        defaultValue = args[2]
      }
    }

    return defaultValue === undefined
      ? workspace
          .getConfiguration(
            section === undefined ? undefined : extensionId,
            resource
          )
          .get<T>(section === undefined ? extensionId : section)!
      : workspace
          .getConfiguration(
            section === undefined ? undefined : extensionId,
            resource
          )
          .get<T>(section === undefined ? extensionId : section, defaultValue)!
  }

  name(...args: string[]) {
    return args.join('.')
  }

  changed(e: ConfigurationChangeEvent, ...args: any[]) {
    let section: string = args[0]
    let resource: Uri | null | undefined
    if (typeof args[1] === 'string') {
      section += `.${args[1]}`
      if (typeof args[2] === 'string') {
        section += `.${args[2]}`
        if (typeof args[3] === 'string') {
          section += args[3]
          resource = args[4]
        } else {
          resource = args[3]
        }
      } else {
        resource = args[2]
      }
    } else {
      resource = args[1]
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return e.affectsConfiguration(`facility.${section}`, resource!)
  }
}

export const configuration = new Configuration()
