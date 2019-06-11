import RouteInfo from "@ember/routing/-private/route-info";

export function dynamicSegmentsFromRouteInfo(routeInfo?: RouteInfo | null): string[] {
  const parts: string[] = [];

  if (!routeInfo) {
    return parts;
  }

  if (routeInfo && routeInfo.paramNames) {
    const parentValues = dynamicSegmentsFromRouteInfo(routeInfo.parent);
    // TODO: fix type
    const values: any = routeInfo.paramNames.map(k => routeInfo.params[k]);

    parts.push(
      ...parentValues,
      ...values,
    );
  }

  return parts;
}
