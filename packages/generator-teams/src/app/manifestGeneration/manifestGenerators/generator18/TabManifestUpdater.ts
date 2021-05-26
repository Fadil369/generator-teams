// Copyright (c) Wictor Wilén. All rights reserved. 
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { IManifestUpdater } from "../../IManifestUpdater";
import { GeneratorTeamsAppOptions } from "../../../GeneratorTeamsAppOptions";
import { v4 as uuid } from 'uuid';

export class TabManifestUpdater implements IManifestUpdater {

    public updateManifest(manifest: any, options: GeneratorTeamsAppOptions): void {
        if (options.tabType == "static") {
            (<any[]>manifest.staticTabs).push({
                entityId: uuid(),
                name: options.tabTitle,
                contentUrl: `https://{{PUBLIC_HOSTNAME}}/${options.tabName}/?name={loginHint}&tenant={tid}&theme={theme}`,
                scopes: ["personal"]
            });
        }
        else {
            const tab: any = {
                configurationUrl: `https://{{PUBLIC_HOSTNAME}}/${options.tabName}/config.html?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
                canUpdateConfiguration: true,
                scopes: options.tabScopes
            };
            if (options.tabSharePoint) {
                tab.sharePointPreviewImage = `https://{{PUBLIC_HOSTNAME}}/assets/${options.tabName}-preview.png`;
                tab.supportedSharePointHosts = options.tabSharePointHosts;
            }
            (<any[]>manifest.configurableTabs).push(tab);
        }
        if (options.tabSSO && manifest.webApplicationInfo === undefined) {
            // only add SSO the first time
            manifest.webApplicationInfo = {
                id: `{{${options.tabUpperName}_APP_ID}}`,
                resource: `{{${options.tabUpperName}_APP_URI}}`
            }
        }
    }
}