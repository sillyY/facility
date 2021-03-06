import { Disposable, TreeItem, TreeItemCollapsibleState } from 'vscode'
import { ContextValues, ViewNode } from '.'
import { App } from '../../app'
import i18n from '../../i18n'
import { ExplorerView } from '../explorerView'
import { MessageNode } from './common'
import { RepositoryNode } from './repositoryNode'
import { SubscribeableViewNode } from './viewNode'

export class ExplorerNode extends SubscribeableViewNode<ExplorerView> {
  private _children: any[] | undefined

  constructor(view: ExplorerView, private isRoot?: Boolean) {
    super(view)
  }
  async getChildren(): Promise<ViewNode[]> {
    const children = []
    const root = await App.explorerTree.getRoot()

    if (!root || !root.element) {
      return [
        new MessageNode(
          this.view,
          this,
          i18n.format('extension.facilityApp.Message.CannotFoundTreeNodes')
        ),
      ]
    }

    // TODO: fix anyscript
    children.push(
      new RepositoryNode(this.view, root.element, (root as any).children)
    )

    this._children = children
    return this._children as any
  }

  getTreeItem() {
    const item = new TreeItem(this.view.name, TreeItemCollapsibleState.Expanded)
    item.contextValue = ContextValues.Explorer
    return item
  }

  refresh() {
    this.onExplorerTreeNodesChanged()
  }

  onExplorerTreeNodesChanged() {
    void this.triggerChange()
  }

  subscribe() {
    return Disposable.from(
      App.explorerTree.onDidChangeNodes(this.onExplorerTreeNodesChanged, this)
    )
  }
}
