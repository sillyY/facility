import {
  InputBoxOptions,
  MessageItem,
  MessageOptions,
  QuickPickOptions,
  SaveDialogOptions,
  Uri,
  window,
  workspace,
} from 'vscode'
import configuration from '../managers/configuration'
import { isWindows } from './libs'

export function openTextDocument(path: string) {
  return workspace.openTextDocument(path)
}

export function showInformationMessage(message: string, options?: MessageOptions, ...items: string[]) {
  return window.showInformationMessage(message, options, ...items)
}

export function showInputBox(options?: InputBoxOptions) {
  return window.showInputBox(options)
}

export function showQuickPick(items: string[], options?: QuickPickOptions) {
  window.showQuickPick(items, options)
}

export function showWarningMessage(item: string) {
  window.showWarningMessage(item)
}

export function showErrorMessage(item: string) {
  window.showErrorMessage(item)
}

export async function showSaveDiaglog(
  options: SaveDialogOptions = {
    defaultUri: Uri.file(configuration.path),
  }
): Promise<string | undefined> {
  const uri = await window.showSaveDialog(options)
  if (uri) {
    let normalized = uri.toString().replace('file://', '')

    if (isWindows) {
      normalized = normalized.replace('/', '')
    }

    return decodeURIComponent(normalized)
  }

  return
}
