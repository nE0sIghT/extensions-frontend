import { ExtensionState, ExtensionType } from "../src/js/constants";

declare global {
    namespace sweettooth {
        export interface Extension {
            name: string;
            icon?: string;
            description: string;
            creator: {
                id: string;
                username: string;
            };
            version: number;
            id: string;
            uuid: string;
            url?: string;
            screenshots: Screenshot[];
            imagePromoMiddle?: string;
            promoTextEnabled?: string;
        }

        export interface Profile {
            username: string;
            extensions: string[];
        }

        export interface Screenshot {
            screenshot: string;
            alttext?: string;
        }

        export interface Comment {
            id: string;
            gravatar: string;
            object_pk: number;
            author: {
                username: string;
                id: number;
            };
            submit_date: string;
            comment: string;
            rating?: number;
        }
    }

    namespace NativeIntegration {
        export function initialize(): Promise<void>;
        export const apiVersion: number;
        export const shellVersion: string;
        export const versionValidationEnabled: boolean;
        export let onShellSettingChanged: undefined | (() => void);
        export let onshellrestart: undefined | (() => void);
        export let onchange: undefined | (() => void);

        export function setExtensionEnabled(uuid: string, enabled: boolean): Promise<boolean>;
        export function installExtension(uuid: string): Promise<'s' | 'successful'>;
        export function uninstallExtension(uuid: string): Promise<boolean>;
        export function launchExtensionPrefs(uuid: string): Promise<void>;
        export function listExtensions(): Promise<Record<string, NativeIntegration.LocalExtension>>;
        export function getExtensionInfo(uuid: string): Promise<NativeIntegration.LocalExtension | null>;

        export interface Update {
            action: string;
            version: number;
        }

        export interface LocalExtension extends sweettooth.Extension {
            state: ExtensionState;
            type: ExtensionType;
            error?: string;
            busy?: boolean;
            inUpdate?: boolean;
            hasUpdate?: boolean;
            hasPrefs: boolean;
            update?: Update;
        }
    }


    var SweetTooth: typeof NativeIntegration | undefined;
}