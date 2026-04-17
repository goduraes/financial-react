import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    layout("routes/protected-route.tsx", [
        index("routes/home.tsx"),
        route("profile", "routes/profile.tsx"),
        route("transactions", "routes/transactions.tsx"),
        route("tags", "routes/tags.tsx"),
        route("admin/users", "routes/admin/users.tsx"),
    ]),
] satisfies RouteConfig;
