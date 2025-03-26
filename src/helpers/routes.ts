export const ROUTES = {
  search: "/app/search",
  businessDetail: "/app/business/:id",
  addBusiness: "/app/business/add",
  listBusinesses: "/app/business/list",
  profile: "/app/profile",
  manageBusiness: "/app/business/manage/:id",
};

export const getRoute = (
  route: keyof typeof ROUTES,
  params?: Record<string, string>
) => {
  let path = ROUTES[route];
  if (params) {
    Object.keys(params).forEach((key) => {
      path = path.replace(`:${key}`, params[key]);
    });
  }
  return path;
};
