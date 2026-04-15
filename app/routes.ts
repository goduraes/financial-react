import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    route("login", "routes/login.tsx"),
    layout("routes/protected-route.tsx", [
        index("routes/home.tsx"),
    ]),
] satisfies RouteConfig;
