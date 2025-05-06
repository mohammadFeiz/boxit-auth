import { FC } from "react";
import AIOApis from "../aio-apis";
export type I_user = {
    username: string;
    name: string;
    hub: {
        text: string;
        id: number;
    };
    isActive: boolean;
    id: number;
};
declare const BoxitAuth: FC<{
    Comp: any;
    base_url: string;
    logout_url: string;
}>;
export default BoxitAuth;
export declare class AuthApis extends AIOApis {
    constructor(p: {
        token: string;
        base_url: string;
    });
    fetchUser: () => Promise<false | I_user>;
}
export declare const BoxitAuthProvider: ({ children, config }: {
    children: React.ReactNode;
    config: any;
}) => import("react/jsx-runtime").JSX.Element;
