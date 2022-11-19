import * as vscode from "vscode";
import path = require("path");
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "ciao-prolog" is now active!');
    const extensionPath = context.extensionPath;
    let t: vscode.Terminal;
    const shellName = "Ciao-shell";
    /** Dispose of previous Ciao terminals if VSCode closed without disposing of them */
    vscode.window.terminals.forEach(terminal => {
        if (terminal.name === shellName) {
            terminal.dispose();
        }
    });
    const run = vscode.commands.registerCommand("ciao-prolog.run", () => {
        const activeDoc: vscode.TextDocument | undefined =
            vscode.window.activeTextEditor?.document;

        if (!activeDoc) {
            vscode.window.showErrorMessage(
                "You must have a ciao file open to run it."
            );
            return;
        }
        const activeDocPath = activeDoc.uri.fsPath;
        const fileExtension = path.extname(activeDocPath);
        if (activeDoc.languageId !== "ciao") {
            if (fileExtension !== ".pl") {
                vscode.window.showErrorMessage(
                    "The current file is not a ciao file"
                );
                return;
            }
            /** First thing should be correctly setting file language */
            vscode.languages.setTextDocumentLanguage(activeDoc, "ciao");
            /** Pray we are not working with Perl */
        }

        vscode.window.showInformationMessage("Running with ciao");

        /** Terminal handling */

        if (t) {
            /** If terminal already exists, dispose of it.
             * assume the program running is trivial
             * */
            t.dispose();
        }
        t = vscode.window.createTerminal({
            name: shellName,
            message: "Running with ciao",
            iconPath: vscode.Uri.file(`${extensionPath}/images/icon.png`),
            isTransient: false,
        });
        t.show();

        /**sendText defaults to adding newLine at the end*/
        t.sendText("ciao");

        t.sendText(`use_module('${activeDocPath}').`);
    });

    context.subscriptions.push(run);
}

export function deactivate() {}
