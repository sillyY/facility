import { ConfigurationChangeEvent } from 'vscode'
import { ViewId, ViewName } from '../config'
import configuration from '../managers/configuration'
import { ExplorerNode } from './nodes/explorerNode'
import ViewBase from './view'

export class ExplorerView extends ViewBase<ExplorerNode> {
  constructor() {
    super(ViewId.Explorer, ViewName.Explorer)
  }
  getRoot() {
    return new ExplorerNode(this, null)
  }

  registerCommands() {}

  onConfigurationChanged(e: ConfigurationChangeEvent) {
    if (configuration.changed(e, 'views', 'repositories', 'location')) {
      this.initialize('facility', { showCollapseAll: true })
    }
    if (!configuration.initializing(e) && this._root !== undefined) {
      // void this.refresh(true)
    }
  }
}