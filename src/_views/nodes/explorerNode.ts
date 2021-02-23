import { Disposable, TreeItem, TreeItemCollapsibleState } from "vscode"
import App from "../../app"
import { ContextValues } from "../../views/nodes"
import { RepositoryNode } from "./repositoryNode"
import { ExplorerView } from "../explorerView"
import { ViewNode } from "./viewNode"

export class ExplorerNode extends ViewNode<ExplorerView> {
  constructor(view, parent) {
    super(view, parent)
  }
  getTreeItem() {
    const item = new TreeItem(this.view.name, TreeItemCollapsibleState.Expanded)
    item.contextValue = ContextValues.Explorer
    return {}
  }

  getChildren() {
    const children = []
    const root = App.tree.getRoot()

    if (!root || !root.element) {
      // TODO: feat meessage node
      return []
    }
    root.children.forEach((item) => {
      children.push(new RepositoryNode(this.view, this, item))
    })
    return children
  }

}
