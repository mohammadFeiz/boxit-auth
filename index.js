var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAuth, AuthProvider } from 'react-oidc-context';
import { Route, Routes, useNavigate } from "react-router-dom";
import AIOApis, { CreateInstance } from "../aio-apis";
const BoxitAuth = ({ Comp, base_url, logout_url }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    function logout() {
        window.location.href = logout_url;
        auth.removeUser();
        setTimeout(() => { window.location.href = logout_url; }, 200);
    }
    useEffect(() => {
        var _a, _b;
        if (auth.isLoading) {
            return;
        }
        const isAuth = auth.isAuthenticated;
        if (!isAuth) {
            auth.signinRedirect();
        }
        else if ((_a = auth === null || auth === void 0 ? void 0 : auth.user) === null || _a === void 0 ? void 0 : _a.access_token) {
            navigate('/');
            localStorage.setItem("token", (_b = auth === null || auth === void 0 ? void 0 : auth.user) === null || _b === void 0 ? void 0 : _b.access_token);
        }
    }, [auth]);
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/Login", element: _jsx("div", {}) }), _jsx(Route, { path: '/*', element: _jsx(BoxitTokenWrapper, { logout: logout, auth: auth, Comp: Comp, base_url: base_url }) })] }));
};
export default BoxitAuth;
const BoxitTokenWrapper = ({ auth, logout, Comp, base_url }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState();
    useEffect(() => {
        var _a;
        const newIsAuthenticated = !!auth.isAuthenticated;
        if (newIsAuthenticated) {
            const token = (_a = auth === null || auth === void 0 ? void 0 : auth.user) === null || _a === void 0 ? void 0 : _a.access_token;
            if (token) {
                setToken(token);
            }
        }
        else {
            setToken('');
        }
        setIsAuthenticated(newIsAuthenticated);
    }, [auth.isAuthenticated]);
    if (!isAuthenticated || !token) {
        return null;
    }
    return _jsx(BoxitUserWrapper, { logout: logout, token: token, base_url: base_url, Comp: Comp });
};
const BoxitUserWrapper = ({ token, logout, base_url, Comp }) => {
    const apis = CreateInstance(new AuthApis({ token, base_url }));
    const [user, setUser] = useState(false);
    const fetchUser = () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield apis.fetchUser();
        if (res) {
            setUser(res);
        }
    });
    useEffect(() => { fetchUser(); }, []);
    if (!user) {
        return null;
    }
    return _jsx(Comp, { logout: logout, user: user, apis: apis, token: token, base_url: base_url });
};
export class AuthApis extends AIOApis {
    constructor(p) {
        super({
            id: 'boxitdriver', base_url: p.base_url, defaults: { token: p.token, messageTime: 30 }, lang: 'fa',
            handleErrorMessage: (err) => 'error'
        });
        this.fetchUser = () => __awaiter(this, void 0, void 0, function* () {
            const { success, response } = yield this.request({ name: '', description: 'دریافت اطلاعات کاربر', method: 'post', url: `/resource-api/permission/fetchPermissionsByUserName`, body: { in: '' } });
            if (success) {
                const user = {
                    username: response.data.userinfo.text,
                    id: response.data.driverInfoDto.driver.id,
                    name: response.data.driverInfoDto.driver.name,
                    isActive: true,
                    hub: {
                        id: response.data.driverInfoDto.selectHub.id,
                        text: response.data.driverInfoDto.selectHub.text
                    }
                };
                return user;
            }
            else {
                return false;
            }
        });
    }
}
const onSigninCallback = (_user) => {
    window.history.replaceState({}, document.title, "/");
};
export const BoxitAuthProvider = ({ children, config }) => (_jsx(AuthProvider, Object.assign({}, config, { onSigninCallback: onSigninCallback, children: children })));
